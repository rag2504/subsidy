# External API Integration Guide

GH₂ SubsidyFlow now integrates with real external data sources to provide live, dynamic information about energy generation, carbon intensity, and hydrogen projects.

## Integrated APIs

### 1. EIA Open Data API
- **Purpose**: Real-time energy generation statistics
- **Data**: Hourly electricity demand, renewable energy generation
- **Usage**: Dashboard shows current energy generation in MWh
- **API Key**: Optional - get from https://www.eia.gov/opendata/documentation.php

### 2. WattTime API
- **Purpose**: Real-time carbon intensity of the electrical grid
- **Data**: Marginal emissions (gCO₂/MWh) for different regions
- **Usage**: Shows current grid carbon intensity and triggers alerts when high
- **API Key**: Optional - get from https://www.watttime.org/api-documentation/

### 3. European Hydrogen Observatory
- **Purpose**: European hydrogen project database
- **Data**: Project locations, capacities, technologies, status
- **Usage**: Displays EU hydrogen projects in a searchable table
- **Note**: Currently using simulated data as no public API exists

### 4. IEA Hydrogen Infrastructure Database
- **Purpose**: Historical and forecasting hydrogen data
- **Data**: Production volumes, growth trends, future projections
- **Usage**: Interactive chart showing historical vs forecast data
- **Note**: Currently using simulated data as no public API exists

## Environment Setup

Create a `.env` file in your project root:

```env
# API Base URLs
VITE_API_BASE_URL=http://localhost:8082/api
VITE_BLOCKCHAIN_RPC_URL=https://polygon-rpc.com

# External API Keys (Optional)
VITE_EIA_API_KEY=your_eia_api_key_here
VITE_WATTTIME_API_KEY=your_watttime_api_key_here
```

## Features

### Real-time Dashboard Cards
- **Energy Generation**: Live data from EIA API showing current MWh
- **Carbon Intensity**: Real-time grid emissions from WattTime
- **EU Projects**: Count of European hydrogen projects
- **IEA Data**: Historical and forecasting data points

### Dynamic Charts
- **IEA Historical Chart**: Interactive line chart with historical vs forecast data
- **Carbon Intensity Alerts**: Color-coded indicators when grid emissions are high
- **Real-time Updates**: Data refreshes every 60 seconds

### EU Projects Table
- **Searchable**: Filter projects by country, technology, status
- **Status Indicators**: Color-coded project status badges
- **Capacity Information**: MW capacity for each project

## Fallback Behavior

The application gracefully handles API failures:
- **No API Keys**: Uses realistic demo data
- **API Errors**: Falls back to mock data with error logging
- **Network Issues**: Continues working with cached data

## Data Refresh

- **Dashboard Stats**: Every 60 seconds
- **External APIs**: Every 60 seconds
- **Notifications**: Real-time as events occur
- **Charts**: Live updates with simulated data

## Benefits

1. **Real-time Accuracy**: Live data from authoritative sources
2. **Transparency**: Users can see actual energy and carbon data
3. **Trust**: Government and industry data sources
4. **Insights**: Historical trends and future projections
5. **Alerts**: Proactive notifications for high carbon intensity

## Future Enhancements

- Direct integration with European Hydrogen Observatory API (when available)
- IEA API access for real historical data
- Additional regional energy data sources
- Machine learning predictions based on historical data
- Cross-border subsidy tracking with international data sources
