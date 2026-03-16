# Climate Analytics Application - Tech Stack & Terms

This document provides an overview of the technologies, libraries, and terms used in the newly re-architected Climate Analytics application.

## Are we using Python for analytics?
**Yes, Python is the primary driver for analytics in this application.**
The core data processing, anomaly detection, statistical aggregations, correlations, and forecasting mathematical operations are now performed entirely on the server-side using a Python backend.

FastAPI is strictly utilized as the API routing layer to expose the Python functions and datasets locally to the frontend via HTTP GET requests. The native mathematical algorithms have been ported over to using `numpy`.

## Core Technologies
*   **Python 3.10+**: The backend language powering data manipulation and heavy computational processes.
*   **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python based on standard Python type hints.
*   **Uvicorn**: An ASGI web server implementation for Python.
*   **React (v19)**: The foundational UI framework used for building the interface components linking the REST API endpoints.
*   **TypeScript**: A strongly typed superset of JavaScript ensuring frontend reliability and rigorous API data checking.
*   **Vite**: A modern, fast build tool mapping the frontend dependencies.

## Analytics & Data Visualization
*   **NumPy**: The fundamental package for scientific computing with Python. Used for means, standard deviations, array handling, and complex regressions/polynomial fits.
*   **Recharts**: A composable charting library built on React components. Used for rendering responsive line, bar, and area charts (e.g., Temperature Trends, Anomaly charts) natively utilizing the backend's provided datasets. 

## Key Terms
*   **Anomalies**: Data points (like temperature readings) that deviate significantly from a dataset's expected behavior, triggering a warning via Z-score evaluation.
*   **Risk Score Gauge**: A visual component calculating a composite danger level based on weights sent by the backend.
*   **Polynomial Regression Forecasts**: Leveraging NumPy's `polyfit` and `poly1d` algorithms to project a trend line into the future (2035) mapping confidence parameters visually across the historical UI charts.

## Detailed Analytics Operations (Backend)

The core strength of this application lies in its deterministic mathematical models, processed in `backend/analytics.py`. For developers onboarding onto the project, here is a detailed breakdown of how the platform extracts intelligence from raw datasets using `numpy`:

### 1. Z-Score Anomaly Detection (`get_anomalies`)
The platform continuously monitors global indicators against their historical baselines to flag severe deviations.
*   **Algorithm**: For each tracked environmental indicator, the system calculates the historical **mean** and **standard deviation**. 
*   **Evaluation**: Every single data point is evaluated to find its Z-score: `Z = (value - mean) / standard_deviation`.
*   **Thresholds**: A data point is flagged as an anomaly if its absolute Z-score breaches the `1.8σ` threshold (`|Z| ≥ 1.8`).
*   **Severity Triage**: Anomalies are dynamically categorized based on how extreme the standard deviation is:
    *   `|Z| ≥ 2.5` ➔ **Critical**
    *   `|Z| ≥ 2.0` ➔ **Medium**
    *   `|Z| < 2.0` ➔ **Low**

### 2. Linear Regression for Trend Analysis (`get_trends`)
To remove noise from volatile year-over-year data, the platform calculates definitive trajectories for all indicators.
*   **Algorithm**: We utilize NumPy's `np.polyfit(xs, ys, 1)` to execute a 1st-degree (linear) regression across the historical dataset.
*   **Outputs**: This mathematical fit provides the **slope** (rate of change) and **intercept** for a best-fit line. 
*   **Confidence Scoring (R²)**: The system calculates the R-squared value (`r2`) by comparing the sum of squared residuals against the total sum of squares, providing a mathematical confidence score for the trend lock.
*   **Directionality**: Based on the slope, indicators are cleanly classified as `rising`, `falling`, or `stable` (slope approaching 0).

### 3. Pearson Correlation Matrix (`get_correlation_matrix`)
The platform exposes hidden structural relationships between disparate climate factors.
*   **Algorithm**: We construct a full mathematical matrix using `np.corrcoef()`. 
*   **Execution**: Every indicator array is cross-analyzed against every other indicator array (e.g., CO2 levels vs. Sea Surface Temperature). 
*   **Result**: The resulting Pearson correlation coefficients (`-1.0` to `1.0`) allow us to map positive and negative chain reactions globally, demonstrating how a shift in one metric statistically impacts another.

### 4. Polynomial Forecasting & Predictive Modeling (`get_forecasts`)
We project high-confidence environmental states into the future (through 2035) to eliminate guesswork in long-term planning.
*   **Algorithm**: Instead of linear regression, the forecasting engine utilizes a 2nd-degree polynomial fit: `np.polyfit(xs, ys, 2)`. This captures accelerating or decelerating curves in the data (like compounding CO2 emissions).
*   **Model Projection**: The resulting coefficients are passed into `np.poly1d` to generate expected values for future years.
*   **Confidence Intervals**: The system doesn't just predict a point; it calculates the Residual Standard Error (RSE) between the historical data and the polynomial fit. It then projects a strict 95% confidence corridor (`± 1.96 * RSE`) around the forecast line.

### 5. Composite Risk Scoring (`get_risk_scores`)
To avoid overwhelming operators with raw multidimensional metrics, the platform synthesizes all data into a single, comprehensive threat assessment score.
*   **Normalization**: Because indicators use entirely different units (e.g., PPM for CO2 vs. Celsius for Temperature), every data point is mathematically normalized mapped to a strict semantic range (`[0, 1]`) based on hardcoded minimum and maximum expected bounds.
*   **Weighted Aggregation**: The normalized values are multiplied by `100` and then aggregated using predefined **weights** assigned to each indicator based on global severity.
*   **Result**: The system outputs a clean `0` to `100` Risk Score gauge that updates dynamically, allowing users to instantly assess the aggregate planetary stress level at any given point in time. 
