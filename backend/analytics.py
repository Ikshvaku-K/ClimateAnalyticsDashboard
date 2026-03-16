import numpy as np
from data import climate_dataset, indicators

def get_anomalies():
    anomalies = []
    years = [d["year"] for d in climate_dataset]
    
    for ind in indicators:
        key = ind["key"]
        values = np.array([float(d[key]) for d in climate_dataset])
        mean = np.mean(values)
        std = np.std(values)
        
        for i, v in enumerate(values):
            z = (v - mean) / std
            abs_z = abs(z)
            
            if abs_z >= 1.8:
                effective_z = -z if ind["inverted"] else z
                if effective_z > 1.8 or abs_z > 2.0:
                    severity = "critical" if abs_z >= 2.5 else "medium" if abs_z >= 2.0 else "low"
                    anomalies.append({
                        "year": years[i],
                        "indicator": key,
                        "value": round(float(v), 3),
                        "zScore": round(float(z), 3),
                        "severity": severity
                    })
                    
    # Sort by year, then by indicator
    anomalies.sort(key=lambda x: (x["year"], x["indicator"]))
    return anomalies

def get_trends():
    trends = []
    xs = np.arange(len(climate_dataset))
    
    for ind in indicators:
        key = ind["key"]
        ys = np.array([float(d[key]) for d in climate_dataset])
        
        # Linear regression using polyfit (degree 1)
        slope, intercept = np.polyfit(xs, ys, 1)
        
        # R-squared calculation
        y_hat = slope * xs + intercept
        ss_res = np.sum((ys - y_hat) ** 2)
        ss_tot = np.sum((ys - np.mean(ys)) ** 2)
        r2 = 1 - (ss_res / ss_tot)
        
        direction = "stable"
        if abs(slope) < 0.01:
            direction = "stable"
        elif slope > 0:
            direction = "falling" if ind["inverted"] else "rising"
        else:
            direction = "rising" if ind["inverted"] else "falling"
            
        trends.append({
            "indicator": key,
            "slope": round(float(slope), 5),
            "intercept": round(float(intercept), 4),
            "r2": round(float(r2), 4),
            "direction": direction,
            "changePerDecade": round(float(slope * 10), 4)
        })
        
    return trends

def normalize_value(value, v_min, v_max, inverted=False):
    norm = (value - v_min) / (v_max - v_min)
    v = 1 - norm if inverted else norm
    return max(0, min(1, v))

def get_risk_scores():
    ranges = {
        "gmst": {"min": 0.40, "max": 1.40},
        "co2": {"min": 368, "max": 430},
        "seaIce": {"min": 3.3, "max": 6.9},
        "seaLevel": {"min": 0, "max": 80},
        "oceanHeat": {"min": 0, "max": 105},
        "extremeIndex": {"min": 25, "max": 95}
    }
    
    scores = []
    for d in climate_dataset:
        breakdown = {}
        weighted_sum = 0
        
        for ind in indicators:
            key = ind["key"]
            v_min = ranges[key]["min"]
            v_max = ranges[key]["max"]
            
            norm = normalize_value(float(d[key]), v_min, v_max, ind["inverted"])
            component_score = norm * 100
            
            breakdown[key] = round(float(component_score), 1)
            weighted_sum += component_score * ind["weight"]
            
        scores.append({
            "year": d["year"],
            "score": round(float(weighted_sum), 1),
            "breakdown": breakdown
        })
        
    return scores

def get_correlation_matrix():
    cells = []
    keys = [ind["key"] for ind in indicators]
    
    for kx in keys:
        ax = np.array([float(d[kx]) for d in climate_dataset])
        for ky in keys:
            ay = np.array([float(d[ky]) for d in climate_dataset])
            # Pearson correlation
            corr = np.corrcoef(ax, ay)[0, 1]
            cells.append({
                "x": kx,
                "y": ky,
                "value": round(float(corr), 3)
            })
            
    return cells

def get_forecasts():
    history_years = [d["year"] for d in climate_dataset]
    base_year = history_years[0]
    forecast_years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
    
    xs = np.array([y - base_year for y in history_years])
    future_xs = np.array([y - base_year for y in forecast_years])
    
    forecasts = []
    z95 = 1.96
    
    for ind in indicators:
        key = ind["key"]
        ys = np.array([float(d[key]) for d in climate_dataset])
        
        # Polyfit degree 2
        coeffs = np.polyfit(xs, ys, 2)
        poly = np.poly1d(coeffs)
        
        # Residual std error
        y_hat = poly(xs)
        residuals = ys - y_hat
        df = len(xs) - 2 - 1 # n - degree - 1
        rse = np.sqrt(np.sum(residuals**2) / df)
        
        historical = []
        for i, y in enumerate(history_years):
            val = round(float(ys[i]), 3)
            historical.append({
                "year": y,
                "value": val,
                "lower": val,
                "upper": val,
                "isForecast": False
            })
            
        future = []
        future_y_hat = poly(future_xs)
        for i, y in enumerate(forecast_years):
            v = future_y_hat[i]
            future.append({
                "year": y,
                "value": round(float(v), 3),
                "lower": round(float(v - z95 * rse), 3),
                "upper": round(float(v + z95 * rse), 3),
                "isForecast": True
            })
            
        forecasts.append({
            "indicator": key,
            "points": historical + future
        })
        
    return forecasts

def get_risk_score_forecast():
    historical_scores = get_risk_scores()
    history_years = [d["year"] for d in historical_scores]
    ys = np.array([d["score"] for d in historical_scores])
    xs = np.arange(len(historical_scores))
    
    forecast_years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]
    future_xs = np.arange(len(historical_scores), len(historical_scores) + len(forecast_years))
    
    # Polyfit degree 2
    coeffs = np.polyfit(xs, ys, 2)
    poly = np.poly1d(coeffs)
    
    # RSE
    y_hat = poly(xs)
    residuals = ys - y_hat
    df = len(xs) - 2 - 1
    rse = np.sqrt(np.sum(residuals**2) / df)
    z95 = 1.96
    
    historical = []
    for d in historical_scores:
        val = round(float(d["score"]), 1)
        historical.append({
            "year": d["year"],
            "score": val,
            "lower": val,
            "upper": val,
            "isForecast": False
        })
        
    future = []
    future_y_hat = poly(future_xs)
    for i, y in enumerate(forecast_years):
        v = max(0, min(100, future_y_hat[i]))
        future.append({
            "year": y,
            "score": round(float(v), 1),
            "lower": round(float(max(0, v - z95 * rse)), 1),
            "upper": round(float(min(100, v + z95 * rse)), 1),
            "isForecast": True
        })
        
    return historical + future
