"""
Configuration and Setup for Claude-Based Real Data Analysis
Environment setup, database connection, and API key management
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional
import json
from dataclasses import dataclass
from dotenv import load_dotenv

@dataclass
class DatabaseConfig:
    """Database connection configuration"""
    server: str
    database: str
    driver: str = "ODBC Driver 17 for SQL Server"
    trusted_connection: bool = True
    username: Optional[str] = None
    password: Optional[str] = None
    
    def get_connection_string(self) -> str:
        """Generate SQLAlchemy connection string"""
        if self.trusted_connection:
            return f"mssql+pyodbc://{self.server}/{self.database}?driver={self.driver.replace(' ', '+')}&trusted_connection=yes"
        else:
            return f"mssql+pyodbc://{self.username}:{self.password}@{self.server}/{self.database}?driver={self.driver.replace(' ', '+')}"

@dataclass
class ClaudeConfig:
    """Claude API configuration"""
    api_key: str
    model: str = "claude-3-5-sonnet-20241022"
    max_tokens: int = 4000
    
@dataclass
class AnalysisConfig:
    """Analysis configuration settings"""
    sample_size: int = 1000
    min_confidence_threshold: float = 0.6
    max_tables_to_analyze: int = 10
    output_directory: str = "analysis_results"
    save_intermediate_results: bool = True

class ConfigManager:
    """Manages configuration for the Claude real data analyzer"""
    
    def __init__(self, config_file: Optional[str] = None):
        # Load environment variables
        load_dotenv()
        
        self.config_file = config_file or "claude_config.json"
        self.config_data = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file or environment"""
        config = {}
        
        # Try to load from file first
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                config = json.load(f)
        
        # Override with environment variables
        config.update({
            "database": {
                "server": os.getenv("DB_SERVER", config.get("database", {}).get("server", "localhost")),
                "database": os.getenv("DB_NAME", config.get("database", {}).get("database", "")),
                "driver": os.getenv("DB_DRIVER", config.get("database", {}).get("driver", "ODBC Driver 17 for SQL Server")),
                "trusted_connection": os.getenv("DB_TRUSTED_CONNECTION", "true").lower() == "true",
                "username": os.getenv("DB_USERNAME", config.get("database", {}).get("username")),
                "password": os.getenv("DB_PASSWORD", config.get("database", {}).get("password"))
            },
            "claude": {
                "api_key": os.getenv("CLAUDE_API_KEY", config.get("claude", {}).get("api_key", "")),
                "model": os.getenv("CLAUDE_MODEL", config.get("claude", {}).get("model", "claude-3-5-sonnet-20241022")),
                "max_tokens": int(os.getenv("CLAUDE_MAX_TOKENS", config.get("claude", {}).get("max_tokens", 4000)))
            },
            "analysis": {
                "sample_size": int(os.getenv("ANALYSIS_SAMPLE_SIZE", config.get("analysis", {}).get("sample_size", 1000))),
                "min_confidence_threshold": float(os.getenv("ANALYSIS_MIN_CONFIDENCE", config.get("analysis", {}).get("min_confidence_threshold", 0.6))),
                "max_tables_to_analyze": int(os.getenv("ANALYSIS_MAX_TABLES", config.get("analysis", {}).get("max_tables_to_analyze", 10))),
                "output_directory": os.getenv("ANALYSIS_OUTPUT_DIR", config.get("analysis", {}).get("output_directory", "analysis_results")),
                "save_intermediate_results": os.getenv("ANALYSIS_SAVE_INTERMEDIATE", "true").lower() == "true"
            }
        })
        
        return config
    
    def get_database_config(self) -> DatabaseConfig:
        """Get database configuration"""
        db_config = self.config_data.get("database", {})
        return DatabaseConfig(
            server=db_config.get("server", "localhost"),
            database=db_config.get("database", ""),
            driver=db_config.get("driver", "ODBC Driver 17 for SQL Server"),
            trusted_connection=db_config.get("trusted_connection", True),
            username=db_config.get("username"),
            password=db_config.get("password")
        )
    
    def get_claude_config(self) -> ClaudeConfig:
        """Get Claude API configuration"""
        claude_config = self.config_data.get("claude", {})
        return ClaudeConfig(
            api_key=claude_config.get("api_key", ""),
            model=claude_config.get("model", "claude-3-5-sonnet-20241022"),
            max_tokens=claude_config.get("max_tokens", 4000)
        )
    
    def get_analysis_config(self) -> AnalysisConfig:
        """Get analysis configuration"""
        analysis_config = self.config_data.get("analysis", {})
        return AnalysisConfig(
            sample_size=analysis_config.get("sample_size", 1000),
            min_confidence_threshold=analysis_config.get("min_confidence_threshold", 0.6),
            max_tables_to_analyze=analysis_config.get("max_tables_to_analyze", 10),
            output_directory=analysis_config.get("output_directory", "analysis_results"),
            save_intermediate_results=analysis_config.get("save_intermediate_results", True)
        )
    
    def validate_config(self) -> Dict[str, bool]:
        """Validate configuration and return status"""
        validation_results = {}
        
        # Validate database config
        db_config = self.get_database_config()
        validation_results["database_server"] = bool(db_config.server)
        validation_results["database_name"] = bool(db_config.database)
        
        # Validate Claude config
        claude_config = self.get_claude_config()
        validation_results["claude_api_key"] = bool(claude_config.api_key)
        
        # Validate analysis config
        analysis_config = self.get_analysis_config()
        validation_results["output_directory"] = True  # Always valid
        
        return validation_results
    
    def save_config_template(self, filename: str = "claude_config_template.json"):
        """Save a configuration template file"""
        template = {
            "database": {
                "server": "localhost",
                "database": "YourSalesDatabase",
                "driver": "ODBC Driver 17 for SQL Server",
                "trusted_connection": True,
                "username": None,
                "password": None
            },
            "claude": {
                "api_key": "your_claude_api_key_here",
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 4000
            },
            "analysis": {
                "sample_size": 1000,
                "min_confidence_threshold": 0.6,
                "max_tables_to_analyze": 10,
                "output_directory": "analysis_results",
                "save_intermediate_results": True
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(template, f, indent=2)
        
        print(f"Configuration template saved to {filename}")
        print("Please update the values and rename to claude_config.json or set environment variables")

def create_env_template(filename: str = ".env.template"):
    """Create environment variable template"""
    template = """# Claude Real Data Analyzer Configuration

# Database Configuration
DB_SERVER=localhost
DB_NAME=YourSalesDatabase
DB_DRIVER=ODBC Driver 17 for SQL Server
DB_TRUSTED_CONNECTION=true
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4000

# Analysis Configuration
ANALYSIS_SAMPLE_SIZE=1000
ANALYSIS_MIN_CONFIDENCE=0.6
ANALYSIS_MAX_TABLES=10
ANALYSIS_OUTPUT_DIR=analysis_results
ANALYSIS_SAVE_INTERMEDIATE=true
"""
    
    with open(filename, 'w') as f:
        f.write(template)
    
    print(f"Environment template saved to {filename}")
    print("Please copy to .env and update the values")

if __name__ == "__main__":
    # Create configuration templates
    config_manager = ConfigManager()
    config_manager.save_config_template()
    create_env_template()
    
    # Test configuration validation
    validation = config_manager.validate_config()
    print("\nConfiguration validation:")
    for key, is_valid in validation.items():
        status = "✓" if is_valid else "✗"
        print(f"{status} {key}")
    
    if not all(validation.values()):
        print("\nPlease configure the missing values before running the analyzer.")