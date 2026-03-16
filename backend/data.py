from typing import List, Dict, Union

# Scientifically-grounded synthetic climate dataset 2000-2025
climate_dataset: List[Dict[str, Union[int, float]]] = [
    {"year": 2000, "gmst": 0.42, "co2": 369.5, "seaIce": 6.32, "seaLevel": 0.0, "oceanHeat": 0.0, "extremeIndex": 28.2},
    {"year": 2001, "gmst": 0.54, "co2": 371.1, "seaIce": 6.75, "seaLevel": 3.2, "oceanHeat": 3.1, "extremeIndex": 30.1},
    {"year": 2002, "gmst": 0.63, "co2": 373.2, "seaIce": 5.96, "seaLevel": 7.5, "oceanHeat": 7.8, "extremeIndex": 33.5},
    {"year": 2003, "gmst": 0.62, "co2": 375.8, "seaIce": 6.15, "seaLevel": 10.2, "oceanHeat": 11.2, "extremeIndex": 38.7},
    {"year": 2004, "gmst": 0.54, "co2": 377.5, "seaIce": 6.04, "seaLevel": 12.8, "oceanHeat": 13.4, "extremeIndex": 32.9},
    {"year": 2005, "gmst": 0.68, "co2": 379.8, "seaIce": 5.57, "seaLevel": 16.1, "oceanHeat": 18.7, "extremeIndex": 40.2},
    {"year": 2006, "gmst": 0.61, "co2": 381.9, "seaIce": 5.92, "seaLevel": 18.4, "oceanHeat": 20.1, "extremeIndex": 37.8},
    {"year": 2007, "gmst": 0.66, "co2": 383.8, "seaIce": 4.30, "seaLevel": 22.3, "oceanHeat": 26.5, "extremeIndex": 45.6},
    {"year": 2008, "gmst": 0.54, "co2": 385.6, "seaIce": 4.71, "seaLevel": 24.0, "oceanHeat": 24.9, "extremeIndex": 41.3},
    {"year": 2009, "gmst": 0.64, "co2": 387.4, "seaIce": 5.36, "seaLevel": 26.8, "oceanHeat": 28.4, "extremeIndex": 39.5},
    {"year": 2010, "gmst": 0.72, "co2": 389.9, "seaIce": 4.90, "seaLevel": 29.4, "oceanHeat": 33.8, "extremeIndex": 49.1},
    {"year": 2011, "gmst": 0.61, "co2": 391.6, "seaIce": 4.61, "seaLevel": 31.7, "oceanHeat": 34.2, "extremeIndex": 46.3},
    {"year": 2012, "gmst": 0.65, "co2": 393.8, "seaIce": 3.41, "seaLevel": 34.5, "oceanHeat": 38.6, "extremeIndex": 52.8},
    {"year": 2013, "gmst": 0.68, "co2": 396.5, "seaIce": 5.10, "seaLevel": 36.8, "oceanHeat": 40.1, "extremeIndex": 48.4},
    {"year": 2014, "gmst": 0.75, "co2": 398.6, "seaIce": 5.02, "seaLevel": 39.2, "oceanHeat": 44.7, "extremeIndex": 50.2},
    {"year": 2015, "gmst": 0.90, "co2": 400.9, "seaIce": 4.68, "seaLevel": 43.1, "oceanHeat": 51.2, "extremeIndex": 60.5},
    {"year": 2016, "gmst": 1.01, "co2": 404.2, "seaIce": 4.14, "seaLevel": 46.8, "oceanHeat": 57.8, "extremeIndex": 67.3},
    {"year": 2017, "gmst": 0.92, "co2": 406.5, "seaIce": 4.72, "seaLevel": 49.2, "oceanHeat": 58.4, "extremeIndex": 62.1},
    {"year": 2018, "gmst": 0.85, "co2": 408.5, "seaIce": 4.59, "seaLevel": 52.1, "oceanHeat": 61.3, "extremeIndex": 59.8},
    {"year": 2019, "gmst": 0.98, "co2": 411.4, "seaIce": 4.15, "seaLevel": 55.6, "oceanHeat": 67.5, "extremeIndex": 68.9},
    {"year": 2020, "gmst": 1.02, "co2": 414.2, "seaIce": 3.92, "seaLevel": 59.0, "oceanHeat": 72.4, "extremeIndex": 73.2},
    {"year": 2021, "gmst": 0.85, "co2": 416.4, "seaIce": 4.72, "seaLevel": 62.1, "oceanHeat": 73.8, "extremeIndex": 68.5},
    {"year": 2022, "gmst": 0.89, "co2": 418.6, "seaIce": 4.67, "seaLevel": 65.4, "oceanHeat": 78.9, "extremeIndex": 71.4},
    {"year": 2023, "gmst": 1.17, "co2": 421.1, "seaIce": 3.77, "seaLevel": 69.8, "oceanHeat": 87.2, "extremeIndex": 82.6},
    {"year": 2024, "gmst": 1.29, "co2": 423.8, "seaIce": 3.61, "seaLevel": 74.2, "oceanHeat": 95.1, "extremeIndex": 88.4},
    {"year": 2025, "gmst": 1.35, "co2": 426.5, "seaIce": 3.49, "seaLevel": 78.4, "oceanHeat": 102.3, "extremeIndex": 91.7},
]

indicators: List[Dict[str, Union[str, float, bool]]] = [
    {"key": "gmst", "label": "Global Temp Anomaly", "unit": "°C", "color": "#ff6b6b", "description": "GMST anomaly vs 1850-1900 baseline", "weight": 0.30, "icon": "🌡️", "inverted": False},
    {"key": "co2", "label": "Atmospheric CO₂", "unit": "ppm", "color": "#ffd93d", "description": "Atmospheric CO₂ concentration", "weight": 0.20, "icon": "🏭", "inverted": False},
    {"key": "seaIce", "label": "Arctic Sea Ice", "unit": "M km²", "color": "#74c0fc", "description": "September minimum Arctic sea ice extent", "weight": 0.15, "icon": "🧊", "inverted": True},
    {"key": "seaLevel", "label": "Sea Level Rise", "unit": "mm", "color": "#4dabf7", "description": "Global mean sea level anomaly vs 2000", "weight": 0.15, "icon": "🌊", "inverted": False},
    {"key": "oceanHeat", "label": "Ocean Heat Content", "unit": "ZJ", "color": "#f06595", "description": "Upper 700m ocean heat content anomaly", "weight": 0.10, "icon": "🔥", "inverted": False},
    {"key": "extremeIndex", "label": "Extreme Events Index", "unit": "", "color": "#ff8c42", "description": "Composite global extreme weather index (0-100)", "weight": 0.10, "icon": "⛈️", "inverted": False}
]

stress_zones: List[Dict] = [
    {"id": 'ssa', "name": 'Sub-Saharan Africa', "lat": -5, "lng": 25, "stressScore": 82.4, "projectedScore2035": 91.2, "topDriver": 'Extreme Heat & Drought', "countries": ['Nigeria', 'Ethiopia', 'DR Congo', 'Tanzania']},
    {"id": 'mena', "name": 'Middle East & North Africa', "lat": 28, "lng": 45, "stressScore": 79.1, "projectedScore2035": 88.7, "topDriver": 'Lethal Heat & Water Scarcity', "countries": ['Iraq', 'Syria', 'Egypt', 'Iran']},
    {"id": 'sa', "name": 'South Asia', "lat": 22, "lng": 80, "stressScore": 76.8, "projectedScore2035": 86.3, "topDriver": 'Monsoon Disruption & Sea Level', "countries": ['India', 'Bangladesh', 'Pakistan']},
    {"id": 'sea', "name": 'Southeast Asia', "lat": 10, "lng": 110, "stressScore": 71.3, "projectedScore2035": 82.1, "topDriver": 'Sea Level Rise & Cyclone Intensity', "countries": ['Philippines', 'Vietnam', 'Indonesia']},
    {"id": 'arctic', "name": 'Arctic Region', "lat": 72, "lng": 10, "stressScore": 88.6, "projectedScore2035": 95.4, "topDriver": 'Ice Sheet Collapse & Permafrost Thaw', "countries": ['Greenland', 'Norway', 'Russia']},
    {"id": 'amazon', "name": 'Amazon Basin', "lat": -5, "lng": -60, "stressScore": 68.9, "projectedScore2035": 79.4, "topDriver": 'Deforestation & Drought', "countries": ['Brazil', 'Peru', 'Colombia']},
    {"id": 'us', "name": 'North America South', "lat": 32, "lng": -95, "stressScore": 55.2, "projectedScore2035": 67.1, "topDriver": 'Hurricane Intensity & Wildfire', "countries": ['USA South', 'Mexico']},
    {"id": 'eu', "name": 'Mediterranean Europe', "lat": 40, "lng": 15, "stressScore": 58.7, "projectedScore2035": 70.3, "topDriver": 'Extreme Heat & Wildfire', "countries": ['Spain', 'Italy', 'Greece', 'Turkey']},
    {"id": 'pacific', "name": 'Pacific Islands', "lat": 10, "lng": 165, "stressScore": 84.2, "projectedScore2035": 93.7, "topDriver": 'Sea Level Rise & Storm Surge', "countries": ['Tuvalu', 'Kiribati', 'Marshall Islands']},
    {"id": 'china', "name": 'East Asia', "lat": 35, "lng": 115, "stressScore": 60.4, "projectedScore2035": 71.8, "topDriver": 'Air Quality & Flood Risk', "countries": ['China', 'South Korea', 'Japan']},
    {"id": 'eca', "name": 'Eastern & Central Asia', "lat": 45, "lng": 65, "stressScore": 52.3, "projectedScore2035": 63.5, "topDriver": 'Glacier Melt & Water Stress', "countries": ['Kazakhstan', 'Uzbekistan', 'Mongolia']},
    {"id": 'aus', "name": 'Australia', "lat": -28, "lng": 135, "stressScore": 63.1, "projectedScore2035": 74.6, "topDriver": 'Megadrought & Bushfire', "countries": ['Australia']},
    {"id": 'ant', "name": 'Antarctic Region', "lat": -75, "lng": 0, "stressScore": 72.5, "projectedScore2035": 83.9, "topDriver": 'Ice Sheet Dynamics', "countries": ['Antarctic']},
    {"id": 'waf', "name": 'West Africa', "lat": 12, "lng": -5, "stressScore": 74.6, "projectedScore2035": 84.1, "topDriver": 'Desertification & Food Security', "countries": ['Mali', 'Niger', 'Senegal', 'Ghana']},
    {"id": 'na_north', "name": 'North America North', "lat": 55, "lng": -95, "stressScore": 42.1, "projectedScore2035": 53.8, "topDriver": 'Permafrost & Wildfire', "countries": ['Canada North', 'Alaska']},
]
