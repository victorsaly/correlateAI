#!/usr/bin/env python3
"""
Quick Start Script for Claude Real Data Analysis
Simplified setup and execution for analyzing MSSQL sales data
"""

import os
import sys
import asyncio
from pathlib import Path
from datetime import datetime

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def check_dependencies():
    """Check if required dependencies are installed"""
    missing_deps = []
    
    try:
        import pandas
    except ImportError:
        missing_deps.append("pandas")
    
    try:
        import sqlalchemy
    except ImportError:
        missing_deps.append("sqlalchemy")
    
    try:
        import pyodbc
    except ImportError:
        missing_deps.append("pyodbc")
    
    try:
        import anthropic
    except ImportError:
        missing_deps.append("anthropic")
    
    if missing_deps:
        print("Missing required dependencies:")
        for dep in missing_deps:
            print(f"  - {dep}")
        print("\nPlease install them using:")
        print(f"pip install {' '.join(missing_deps)}")
        print("\nOr install all dependencies with:")
        print("pip install -r requirements-claude.txt")
        return False
    
    return True

def setup_configuration():
    """Interactive configuration setup"""
    print("=== Claude Real Data Analyzer Configuration ===\n")
    
    # Database configuration
    print("Database Configuration:")
    db_server = input("Database server (default: localhost): ").strip() or "localhost"
    db_name = input("Database name: ").strip()
    
    if not db_name:
        print("Database name is required!")
        return False
    
    use_trusted = input("Use Windows Authentication? (y/N): ").strip().lower()
    trusted_connection = use_trusted in ['y', 'yes']
    
    db_username = ""
    db_password = ""
    if not trusted_connection:
        db_username = input("Database username: ").strip()
        db_password = input("Database password: ").strip()
    
    # Claude API configuration
    print("\nClaude API Configuration:")
    claude_api_key = input("Claude API key: ").strip()
    
    if not claude_api_key:
        print("Claude API key is required!")
        print("Get your API key from: https://console.anthropic.com/")
        return False
    
    # Create .env file
    env_content = f"""# Claude Real Data Analyzer Configuration
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

# Database Configuration
DB_SERVER={db_server}
DB_NAME={db_name}
DB_DRIVER=ODBC Driver 17 for SQL Server
DB_TRUSTED_CONNECTION={str(trusted_connection).lower()}
"""
    
    if not trusted_connection:
        env_content += f"""DB_USERNAME={db_username}
DB_PASSWORD={db_password}
"""
    
    env_content += f"""
# Claude API Configuration
CLAUDE_API_KEY={claude_api_key}
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4000

# Analysis Configuration
ANALYSIS_SAMPLE_SIZE=1000
ANALYSIS_MIN_CONFIDENCE=0.6
ANALYSIS_MAX_TABLES=10
ANALYSIS_OUTPUT_DIR=analysis_results
ANALYSIS_SAVE_INTERMEDIATE=true
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print(f"\nConfiguration saved to .env file")
    return True

async def run_sample_analysis():
    """Run a sample analysis"""
    try:
        from claude_agents.config import ConfigManager
        from claude_agents.real_data_analyzer import SalesDataAnalyzer
        
        print("\n=== Starting Sales Data Analysis ===\n")
        
        # Load configuration
        config_manager = ConfigManager()
        
        # Validate configuration
        validation = config_manager.validate_config()
        if not all(validation.values()):
            print("Configuration validation failed:")
            for key, is_valid in validation.items():
                if not is_valid:
                    print(f"  ✗ {key}")
            return False
        
        # Get configurations
        db_config = config_manager.get_database_config()
        claude_config = config_manager.get_claude_config()
        
        print(f"Connecting to database: {db_config.server}/{db_config.database}")
        print(f"Using Claude model: {claude_config.model}")
        
        # Create analyzer
        connection_string = db_config.get_connection_string()
        analyzer = SalesDataAnalyzer(connection_string, claude_config.api_key)
        
        # Run analysis
        results = await analyzer.run_full_analysis()
        
        # Display results
        print("\n" + "="*60)
        print("ANALYSIS RESULTS SUMMARY")
        print("="*60)
        
        db_analysis = results['database_analysis']
        exec_report = results['executive_report']
        
        print(f"Tables analyzed: {db_analysis['tables_analyzed']}")
        print(f"Total records: {db_analysis['total_records']:,}")
        print(f"Key metrics found: {db_analysis['key_metrics_found']}")
        print(f"Insights discovered: {results['insights_discovered']}")
        
        exec_summary = exec_report['executive_summary']
        print(f"High-confidence insights: {exec_summary['high_confidence_insights']}")
        print(f"Correlations found: {exec_summary['correlations_found']}")
        print(f"Business opportunities: {exec_summary['opportunities_discovered']}")
        
        print("\nTop 3 Key Findings:")
        for i, finding in enumerate(exec_report['key_findings'][:3], 1):
            print(f"\n{i}. {finding['title']}")
            print(f"   Business Impact: {finding['impact']}")
            print(f"   Confidence: {finding['confidence']:.1%}")
            if finding['recommended_actions']:
                print(f"   Key Action: {finding['recommended_actions'][0]}")
        
        print(f"\nDetailed results saved to: complete_sales_analysis.json")
        print(f"Insights saved to: correlation_insights.json")
        
        return True
        
    except Exception as e:
        print(f"Analysis failed: {e}")
        return False

def main():
    """Main execution function"""
    print("Claude Real Data Analyzer - Quick Start")
    print("="*50)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("\nNo configuration found. Let's set it up!")
        if not setup_configuration():
            return
    else:
        print("\nConfiguration file found.")
        reconfigure = input("Reconfigure? (y/N): ").strip().lower()
        if reconfigure in ['y', 'yes']:
            if not setup_configuration():
                return
    
    # Run analysis
    print("\nStarting analysis...")
    try:
        # Import datetime for env file generation
        success = asyncio.run(run_sample_analysis())
        
        if success:
            print("\n🎉 Analysis completed successfully!")
            print("\nNext steps:")
            print("1. Review the generated reports")
            print("2. Implement recommended actions")
            print("3. Set up automated analysis schedule")
            print("4. Share insights with stakeholders")
        else:
            print("\n❌ Analysis failed. Please check the configuration and try again.")
            
    except KeyboardInterrupt:
        print("\n\nAnalysis interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()