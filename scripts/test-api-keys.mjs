#!/usr/bin/env node

import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const API_KEYS = {
  FRED: process.env.VITE_FRED_API_KEY,
  ALPHA_VANTAGE: process.env.VITE_ALPHA_VANTAGE_API_KEY,
  OPENWEATHER: process.env.VITE_OPENWEATHER_API_KEY
};

async function testFredAPI() {
  try {
    console.log('🏛️ Testing FRED API...');
    const response = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: 'GDP',
        api_key: API_KEYS.FRED,
        file_type: 'json',
        limit: 5
      },
      timeout: 10000
    });
    
    if (response.data && response.data.observations) {
      console.log('✅ FRED API: Connected successfully');
      console.log(`   Sample data: ${response.data.observations.length} GDP observations`);
      return true;
    } else {
      console.log('❌ FRED API: Invalid response format');
      return false;
    }
  } catch (error) {
    console.log('❌ FRED API Error:', error.response?.data?.error_message || error.message);
    return false;
  }
}

async function testAlphaVantageAPI() {
  try {
    console.log('💹 Testing Alpha Vantage API...');
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: 'AAPL',
        apikey: API_KEYS.ALPHA_VANTAGE
      },
      timeout: 10000
    });
    
    if (response.data && response.data['Global Quote']) {
      console.log('✅ Alpha Vantage API: Connected successfully');
      console.log(`   Sample data: AAPL quote retrieved`);
      return true;
    } else if (response.data && response.data['Error Message']) {
      console.log('❌ Alpha Vantage API Error:', response.data['Error Message']);
      return false;
    } else if (response.data && response.data['Note']) {
      console.log('⚠️ Alpha Vantage API: Rate limited, but key is valid');
      console.log('   Note:', response.data['Note']);
      return true;
    } else {
      console.log('❌ Alpha Vantage API: Unexpected response format');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Alpha Vantage API Error:', error.message);
    return false;
  }
}

async function testOpenWeatherAPI() {
  try {
    console.log('🌤️ Testing OpenWeather API...');
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'London',
        appid: API_KEYS.OPENWEATHER,
        units: 'metric'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.weather) {
      console.log('✅ OpenWeather API: Connected successfully');
      console.log(`   Sample data: ${response.data.name} weather retrieved`);
      return true;
    } else {
      console.log('❌ OpenWeather API: Invalid response format');
      return false;
    }
  } catch (error) {
    console.log('❌ OpenWeather API Error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 API Key Validation Test');
  console.log('==========================\n');
  
  console.log('🔑 API Keys Found:');
  Object.entries(API_KEYS).forEach(([name, key]) => {
    console.log(`   ${name}: ${key ? '✅ Present (' + key.slice(0, 8) + '...)' : '❌ Missing'}`);
  });
  console.log('');
  
  const results = [];
  
  // Test all APIs
  results.push({ name: 'FRED', success: await testFredAPI() });
  results.push({ name: 'Alpha Vantage', success: await testAlphaVantageAPI() });
  results.push({ name: 'OpenWeather', success: await testOpenWeatherAPI() });
  
  console.log('\n📋 Test Summary');
  console.log('===============');
  
  let allPassed = true;
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name} API`);
    if (!result.success) allPassed = false;
  });
  
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall Status: ${allPassed ? 'All APIs working!' : 'Some APIs need attention'}`);
  
  if (allPassed) {
    console.log('\n🚀 Ready for GitHub Actions deployment!');
    console.log('Next steps:');
    console.log('1. Add these same API keys to GitHub repository secrets');
    console.log('2. Push your workflow file to trigger automated collection');
  }
}

main().catch(console.error);