"""
CorrelateAI Enterprise - Advanced Correlation Engine
Sophisticated correlation analysis with machine learning and statistical methods
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
from scipy import stats
from scipy.signal import find_peaks
import warnings
warnings.filterwarnings('ignore')

@dataclass
class AdvancedCorrelation:
    """Advanced correlation result with multiple analysis methods"""
    metric1: str
    metric2: str
    pearson_correlation: float
    spearman_correlation: float
    kendall_correlation: float
    mutual_information: float
    granger_causality_p_value: float
    lag_correlation: Dict[int, float]
    ml_feature_importance: float
    r_squared: float
    statistical_significance: float
    business_impact_score: float
    correlation_type: str  # 'linear', 'non-linear', 'lagged', 'seasonal'
    confidence_interval: Tuple[float, float]
    data_quality_score: float

@dataclass
class TimeSeriesPattern:
    """Time series pattern analysis result"""
    metric_name: str
    trend_direction: str  # 'increasing', 'decreasing', 'stable'
    trend_strength: float
    seasonality_detected: bool
    seasonal_period: Optional[int]
    volatility_score: float
    anomaly_periods: List[datetime]
    change_points: List[datetime]
    forecast_direction: str
    confidence_level: float

class AdvancedCorrelationEngine:
    """
    Advanced correlation analysis engine with multiple statistical and ML methods
    """
    
    def __init__(self):
        self.min_data_points = 10
        self.significance_level = 0.05
        self.max_lag = 6  # Maximum lag periods to test
        self.scaler = StandardScaler()
        
    def analyze_comprehensive_correlations(
        self, 
        data: pd.DataFrame, 
        time_column: str = 'timestamp',
        metric_columns: List[str] = None
    ) -> List[AdvancedCorrelation]:
        """
        Perform comprehensive correlation analysis using multiple methods
        
        Args:
            data: DataFrame with time series data
            time_column: Name of the timestamp column
            metric_columns: List of metric columns to analyze
            
        Returns:
            List of AdvancedCorrelation objects
        """
        if metric_columns is None:
            metric_columns = [col for col in data.columns if col != time_column and data[col].dtype in ['float64', 'int64']]
        
        # Ensure data is sorted by time
        data = data.sort_values(time_column).reset_index(drop=True)
        
        correlations = []
        
        # Analyze all pairs of metrics
        for i in range(len(metric_columns)):
            for j in range(i + 1, len(metric_columns)):
                metric1 = metric_columns[i]
                metric2 = metric_columns[j]
                
                # Extract clean data for this pair
                pair_data = data[[time_column, metric1, metric2]].dropna()
                
                if len(pair_data) >= self.min_data_points:
                    correlation = self._analyze_metric_pair(
                        pair_data, time_column, metric1, metric2
                    )
                    if correlation:
                        correlations.append(correlation)
        
        return sorted(correlations, key=lambda x: x.business_impact_score, reverse=True)
    
    def _analyze_metric_pair(
        self, 
        data: pd.DataFrame, 
        time_col: str, 
        metric1: str, 
        metric2: str
    ) -> Optional[AdvancedCorrelation]:
        """Analyze a single pair of metrics comprehensively"""
        
        values1 = data[metric1].values
        values2 = data[metric2].values
        
        # Data quality assessment
        quality_score = self._assess_data_quality(values1, values2)
        if quality_score < 0.5:  # Skip poor quality data
            return None
        
        # Basic correlations
        pearson_corr, pearson_p = stats.pearsonr(values1, values2)
        spearman_corr, spearman_p = stats.spearmanr(values1, values2)
        kendall_corr, kendall_p = stats.kendalltau(values1, values2)
        
        # Mutual information
        mutual_info = self._calculate_mutual_information(values1, values2)
        
        # Granger causality test
        granger_p = self._granger_causality_test(values1, values2)
        
        # Lag correlation analysis
        lag_correlations = self._analyze_lag_correlations(values1, values2)
        
        # Machine learning feature importance
        ml_importance, r_squared = self._ml_feature_importance(values1, values2)
        
        # Statistical significance (using the strongest correlation)
        strongest_corr = max([abs(pearson_corr), abs(spearman_corr), abs(kendall_corr)])
        significance = min([pearson_p, spearman_p, kendall_p])
        
        # Determine correlation type
        correlation_type = self._determine_correlation_type(
            pearson_corr, spearman_corr, lag_correlations, mutual_info
        )
        
        # Confidence interval for Pearson correlation
        conf_interval = self._calculate_confidence_interval(pearson_corr, len(values1))
        
        # Business impact score
        impact_score = self._calculate_business_impact_score(
            metric1, metric2, strongest_corr, significance, quality_score
        )
        
        return AdvancedCorrelation(
            metric1=metric1,
            metric2=metric2,
            pearson_correlation=pearson_corr,
            spearman_correlation=spearman_corr,
            kendall_correlation=kendall_corr,
            mutual_information=mutual_info,
            granger_causality_p_value=granger_p,
            lag_correlation=lag_correlations,
            ml_feature_importance=ml_importance,
            r_squared=r_squared,
            statistical_significance=significance,
            business_impact_score=impact_score,
            correlation_type=correlation_type,
            confidence_interval=conf_interval,
            data_quality_score=quality_score
        )
    
    def _assess_data_quality(self, values1: np.ndarray, values2: np.ndarray) -> float:
        """Assess the quality of the data for correlation analysis"""
        total_points = len(values1)
        
        # Check for missing values (already handled by dropna, but double-check)
        missing_penalty = 0
        
        # Check for variance (avoid constant values)
        var1 = np.var(values1)
        var2 = np.var(values2)
        variance_score = 1.0 if var1 > 0 and var2 > 0 else 0.0
        
        # Check for outliers (using IQR method)
        outlier_score1 = self._outlier_score(values1)
        outlier_score2 = self._outlier_score(values2)
        outlier_score = (outlier_score1 + outlier_score2) / 2
        
        # Check data distribution normality
        _, normality_p1 = stats.normaltest(values1) if len(values1) > 8 else (0, 1)
        _, normality_p2 = stats.normaltest(values2) if len(values2) > 8 else (0, 1)
        normality_score = (min(1.0, normality_p1 * 10) + min(1.0, normality_p2 * 10)) / 2
        
        # Combine scores
        quality_score = (variance_score * 0.4 + outlier_score * 0.3 + normality_score * 0.3)
        
        return quality_score
    
    def _outlier_score(self, values: np.ndarray) -> float:
        """Calculate outlier score (higher is better)"""
        q1 = np.percentile(values, 25)
        q3 = np.percentile(values, 75)
        iqr = q3 - q1
        
        if iqr == 0:
            return 0.5
        
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        outliers = np.sum((values < lower_bound) | (values > upper_bound))
        outlier_ratio = outliers / len(values)
        
        return max(0, 1 - outlier_ratio * 2)  # Penalize high outlier ratios
    
    def _calculate_mutual_information(self, values1: np.ndarray, values2: np.ndarray) -> float:
        """Calculate mutual information between two variables"""
        try:
            from sklearn.feature_selection import mutual_info_regression
            values1_reshaped = values1.reshape(-1, 1)
            mi = mutual_info_regression(values1_reshaped, values2)
            return mi[0]
        except:
            # Fallback to correlation-based approximation
            corr = np.corrcoef(values1, values2)[0, 1]
            return -0.5 * np.log(1 - corr**2) if abs(corr) < 0.99 else 1.0
    
    def _granger_causality_test(self, values1: np.ndarray, values2: np.ndarray) -> float:
        """Simplified Granger causality test"""
        # This is a simplified version - in production, use statsmodels.tsa.stattools.grangercausalitytests
        try:
            if len(values1) < 10:
                return 1.0
            
            # Create lagged features
            lags = min(3, len(values1) // 3)
            
            # Prepare data for regression
            y = values2[lags:]
            X_restricted = values2[lags-1:-1].reshape(-1, 1)  # Only y lagged
            X_full = np.column_stack([
                values2[lags-1:-1],  # y lagged
                values1[lags-1:-1]   # x lagged
            ])
            
            # Fit models
            from sklearn.linear_model import LinearRegression
            
            model_restricted = LinearRegression().fit(X_restricted, y)
            model_full = LinearRegression().fit(X_full, y)
            
            # Calculate F-statistic approximation
            rss_restricted = np.sum((y - model_restricted.predict(X_restricted))**2)
            rss_full = np.sum((y - model_full.predict(X_full))**2)
            
            if rss_full == 0:
                return 0.0
                
            f_stat = ((rss_restricted - rss_full) / rss_full) * (len(y) - 2)
            
            # Convert to p-value approximation
            p_value = max(0.001, 1 / (1 + f_stat))
            
            return p_value
            
        except:
            return 1.0  # No causality detected
    
    def _analyze_lag_correlations(self, values1: np.ndarray, values2: np.ndarray) -> Dict[int, float]:
        """Analyze correlations at different time lags"""
        lag_correlations = {}
        
        for lag in range(1, min(self.max_lag + 1, len(values1) // 2)):
            if len(values1) - lag > 3:
                # values1 leads values2 by lag periods
                corr_forward, _ = stats.pearsonr(values1[:-lag], values2[lag:])
                # values2 leads values1 by lag periods  
                corr_backward, _ = stats.pearsonr(values2[:-lag], values1[lag:])
                
                # Store the stronger correlation
                lag_correlations[lag] = corr_forward
                lag_correlations[-lag] = corr_backward
        
        return lag_correlations
    
    def _ml_feature_importance(self, values1: np.ndarray, values2: np.ndarray) -> Tuple[float, float]:
        """Calculate feature importance using machine learning"""
        try:
            # Create features from values1 to predict values2
            X = self._create_features(values1)
            y = values2[:len(X)]
            
            if len(X) < 5:
                return 0.0, 0.0
            
            # Train random forest
            rf = RandomForestRegressor(n_estimators=50, random_state=42)
            rf.fit(X, y)
            
            # Get feature importance and R-squared
            importance = np.mean(rf.feature_importances_)
            r2 = r2_score(y, rf.predict(X))
            
            return importance, max(0, r2)
            
        except:
            return 0.0, 0.0
    
    def _create_features(self, values: np.ndarray) -> np.ndarray:
        """Create features from time series for ML analysis"""
        features = []
        
        # Moving averages
        for window in [3, 5]:
            if len(values) >= window:
                ma = pd.Series(values).rolling(window=window).mean().fillna(method='bfill')
                features.append(ma.values)
        
        # Differences
        if len(values) > 1:
            diff = np.diff(values, prepend=values[0])
            features.append(diff)
        
        # Lag features
        for lag in [1, 2]:
            if len(values) > lag:
                lagged = np.concatenate([values[:lag], values[:-lag]])
                features.append(lagged)
        
        if not features:
            return values.reshape(-1, 1)
        
        # Combine all features
        min_length = min(len(f) for f in features)
        features = [f[:min_length] for f in features]
        
        return np.column_stack(features)
    
    def _determine_correlation_type(
        self, 
        pearson: float, 
        spearman: float, 
        lag_correlations: Dict[int, float],
        mutual_info: float
    ) -> str:
        """Determine the type of correlation detected"""
        
        # Strong lag correlation
        max_lag_corr = max([abs(v) for v in lag_correlations.values()]) if lag_correlations else 0
        if max_lag_corr > abs(pearson) + 0.1:
            return 'lagged'
        
        # Non-linear relationship (spearman much stronger than pearson)
        if abs(spearman) > abs(pearson) + 0.2:
            return 'non-linear'
        
        # High mutual information but low linear correlation
        if mutual_info > 0.3 and abs(pearson) < 0.3:
            return 'non-linear'
        
        # Default to linear
        if abs(pearson) > 0.3:
            return 'linear'
        
        return 'weak'
    
    def _calculate_confidence_interval(self, correlation: float, n: int) -> Tuple[float, float]:
        """Calculate confidence interval for correlation coefficient"""
        if abs(correlation) >= 0.99:
            return (correlation - 0.01, correlation + 0.01)
        
        # Fisher transformation
        z = 0.5 * np.log((1 + correlation) / (1 - correlation))
        z_se = 1 / np.sqrt(n - 3)
        
        # 95% confidence interval
        z_margin = 1.96 * z_se
        z_lower = z - z_margin
        z_upper = z + z_margin
        
        # Transform back
        r_lower = (np.exp(2 * z_lower) - 1) / (np.exp(2 * z_lower) + 1)
        r_upper = (np.exp(2 * z_upper) - 1) / (np.exp(2 * z_upper) + 1)
        
        return (r_lower, r_upper)
    
    def _calculate_business_impact_score(
        self, 
        metric1: str, 
        metric2: str, 
        correlation: float, 
        significance: float,
        quality_score: float
    ) -> float:
        """Calculate business impact score (0-10)"""
        
        # Base score from correlation strength
        base_score = abs(correlation) * 10
        
        # Significance boost
        if significance < 0.01:
            significance_multiplier = 1.3
        elif significance < 0.05:
            significance_multiplier = 1.1
        else:
            significance_multiplier = 0.8
        
        # Business importance weights
        high_impact_metrics = [
            'revenue', 'sales', 'profit', 'customer', 'cost', 'margin'
        ]
        
        metric1_lower = metric1.lower()
        metric2_lower = metric2.lower()
        
        business_multiplier = 1.0
        for keyword in high_impact_metrics:
            if keyword in metric1_lower or keyword in metric2_lower:
                business_multiplier = 1.4
                break
        
        # Quality adjustment
        quality_multiplier = 0.5 + (quality_score * 0.5)
        
        # Calculate final score
        final_score = base_score * significance_multiplier * business_multiplier * quality_multiplier
        
        return min(10.0, final_score)

class TimeSeriesAnalyzer:
    """Advanced time series pattern analysis"""
    
    def __init__(self):
        self.min_periods = 12
        
    def analyze_patterns(self, data: pd.DataFrame, time_col: str, metric_cols: List[str]) -> List[TimeSeriesPattern]:
        """Analyze time series patterns for multiple metrics"""
        patterns = []
        
        for metric in metric_cols:
            pattern = self._analyze_single_metric(data, time_col, metric)
            if pattern:
                patterns.append(pattern)
        
        return patterns
    
    def _analyze_single_metric(self, data: pd.DataFrame, time_col: str, metric: str) -> Optional[TimeSeriesPattern]:
        """Analyze patterns in a single time series"""
        
        # Clean data
        clean_data = data[[time_col, metric]].dropna().sort_values(time_col)
        
        if len(clean_data) < self.min_periods:
            return None
        
        values = clean_data[metric].values
        timestamps = pd.to_datetime(clean_data[time_col])
        
        # Trend analysis
        trend_direction, trend_strength = self._analyze_trend(values)
        
        # Seasonality detection
        seasonality_detected, seasonal_period = self._detect_seasonality(values)
        
        # Volatility analysis
        volatility_score = self._calculate_volatility(values)
        
        # Anomaly detection
        anomaly_periods = self._detect_anomalies(timestamps, values)
        
        # Change point detection
        change_points = self._detect_change_points(timestamps, values)
        
        # Forecast direction
        forecast_direction = self._predict_direction(values)
        
        # Confidence level
        confidence_level = self._calculate_confidence(values, trend_strength, volatility_score)
        
        return TimeSeriesPattern(
            metric_name=metric,
            trend_direction=trend_direction,
            trend_strength=trend_strength,
            seasonality_detected=seasonality_detected,
            seasonal_period=seasonal_period,
            volatility_score=volatility_score,
            anomaly_periods=anomaly_periods,
            change_points=change_points,
            forecast_direction=forecast_direction,
            confidence_level=confidence_level
        )
    
    def _analyze_trend(self, values: np.ndarray) -> Tuple[str, float]:
        """Analyze trend direction and strength"""
        x = np.arange(len(values))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, values)
        
        trend_strength = abs(r_value)
        
        if p_value > 0.05:  # Not significant
            return 'stable', trend_strength
        elif slope > 0:
            return 'increasing', trend_strength
        else:
            return 'decreasing', trend_strength
    
    def _detect_seasonality(self, values: np.ndarray) -> Tuple[bool, Optional[int]]:
        """Detect seasonal patterns"""
        if len(values) < 24:  # Need at least 2 years of monthly data
            return False, None
        
        # Try different seasonal periods
        periods_to_test = [12, 4, 6]  # Monthly, quarterly, bi-annual
        
        best_period = None
        best_score = 0
        
        for period in periods_to_test:
            if len(values) >= 2 * period:
                score = self._calculate_seasonal_score(values, period)
                if score > best_score:
                    best_score = score
                    best_period = period
        
        return best_score > 0.3, best_period
    
    def _calculate_seasonal_score(self, values: np.ndarray, period: int) -> float:
        """Calculate seasonality score for a given period"""
        # Reshape into seasonal periods
        n_periods = len(values) // period
        if n_periods < 2:
            return 0
        
        seasonal_data = values[:n_periods * period].reshape(n_periods, period)
        
        # Calculate correlation between seasons
        correlations = []
        for i in range(period):
            if np.var(seasonal_data[:, i]) > 0:
                for j in range(i + 1, period):
                    if np.var(seasonal_data[:, j]) > 0:
                        corr, _ = stats.pearsonr(seasonal_data[:, i], seasonal_data[:, j])
                        correlations.append(abs(corr))
        
        return np.mean(correlations) if correlations else 0
    
    def _calculate_volatility(self, values: np.ndarray) -> float:
        """Calculate volatility score"""
        if len(values) < 2:
            return 0
        
        # Calculate rolling standard deviation
        returns = np.diff(values) / values[:-1]
        volatility = np.std(returns)
        
        # Normalize to 0-1 scale
        return min(1.0, volatility * 10)
    
    def _detect_anomalies(self, timestamps: pd.Series, values: np.ndarray) -> List[datetime]:
        """Detect anomalous periods"""
        if len(values) < 10:
            return []
        
        # Use IQR method for anomaly detection
        q1 = np.percentile(values, 25)
        q3 = np.percentile(values, 75)
        iqr = q3 - q1
        
        lower_bound = q1 - 2 * iqr
        upper_bound = q3 + 2 * iqr
        
        anomaly_indices = np.where((values < lower_bound) | (values > upper_bound))[0]
        
        return [timestamps.iloc[i] for i in anomaly_indices]
    
    def _detect_change_points(self, timestamps: pd.Series, values: np.ndarray) -> List[datetime]:
        """Detect significant change points"""
        if len(values) < 6:
            return []
        
        change_points = []
        
        # Simple change point detection using moving averages
        window = max(3, len(values) // 6)
        
        for i in range(window, len(values) - window):
            before = np.mean(values[i-window:i])
            after = np.mean(values[i:i+window])
            
            # Calculate relative change
            if before != 0:
                change = abs(after - before) / abs(before)
                if change > 0.3:  # 30% change threshold
                    change_points.append(timestamps.iloc[i])
        
        return change_points
    
    def _predict_direction(self, values: np.ndarray) -> str:
        """Predict future direction based on recent trend"""
        if len(values) < 3:
            return 'stable'
        
        # Look at recent trend (last quarter of data)
        recent_size = max(3, len(values) // 4)
        recent_values = values[-recent_size:]
        
        x = np.arange(len(recent_values))
        slope, _, r_value, p_value, _ = stats.linregress(x, recent_values)
        
        if p_value > 0.1 or abs(r_value) < 0.3:
            return 'stable'
        elif slope > 0:
            return 'increasing'
        else:
            return 'decreasing'
    
    def _calculate_confidence(self, values: np.ndarray, trend_strength: float, volatility_score: float) -> float:
        """Calculate confidence level in the analysis"""
        data_quality = min(1.0, len(values) / 24)  # More data = higher confidence
        trend_confidence = trend_strength
        volatility_penalty = max(0, 1 - volatility_score)
        
        confidence = (data_quality * 0.4 + trend_confidence * 0.4 + volatility_penalty * 0.2)
        
        return confidence

# Example usage
def example_usage():
    """Example of how to use the advanced correlation engine"""
    
    # Sample data creation
    np.random.seed(42)
    dates = pd.date_range('2023-01-01', periods=24, freq='M')
    
    # Create correlated sample data
    base_trend = np.linspace(100, 150, 24)
    marketing_spend = base_trend + np.random.normal(0, 10, 24)
    sales_revenue = marketing_spend * 2.5 + np.random.normal(0, 15, 24)
    customer_count = marketing_spend * 0.8 + np.random.normal(0, 5, 24)
    
    data = pd.DataFrame({
        'timestamp': dates,
        'Marketing Spend': marketing_spend,
        'Sales Revenue': sales_revenue,
        'Customer Count': customer_count
    })
    
    # Initialize engines
    correlation_engine = AdvancedCorrelationEngine()
    time_series_analyzer = TimeSeriesAnalyzer()
    
    # Analyze correlations
    correlations = correlation_engine.analyze_comprehensive_correlations(data)
    
    # Analyze time series patterns
    patterns = time_series_analyzer.analyze_patterns(
        data, 'timestamp', ['Marketing Spend', 'Sales Revenue', 'Customer Count']
    )
    
    # Display results
    print("=== ADVANCED CORRELATION ANALYSIS ===")
    for corr in correlations:
        print(f"\n{corr.metric1} ↔ {corr.metric2}")
        print(f"  Pearson: {corr.pearson_correlation:.3f}")
        print(f"  Type: {corr.correlation_type}")
        print(f"  Business Impact: {corr.business_impact_score:.1f}/10")
        print(f"  Confidence: {corr.confidence_interval}")
    
    print("\n=== TIME SERIES PATTERNS ===")
    for pattern in patterns:
        print(f"\n{pattern.metric_name}")
        print(f"  Trend: {pattern.trend_direction} (strength: {pattern.trend_strength:.3f})")
        print(f"  Seasonality: {pattern.seasonality_detected}")
        print(f"  Volatility: {pattern.volatility_score:.3f}")
        print(f"  Forecast: {pattern.forecast_direction}")

if __name__ == "__main__":
    example_usage()