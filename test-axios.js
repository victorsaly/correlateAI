import axios from 'axios';

async function testAxios() {
    console.log('✅ Axios imported successfully');
    
    // Test a simple HTTP request to a reliable endpoint
    try {
        const response = await axios.get('https://httpbin.org/json', {
            timeout: 10000
        });
        console.log('✅ HTTP request successful');
        console.log('✅ Response status:', response.status);
    } catch (error) {
        console.error('❌ HTTP request failed:', error.message);
        throw error;
    }
}

testAxios().then(() => {
    console.log('🎉 Axios test successful');
}).catch(error => {
    console.error('❌ Axios test failed:', error.message);
    process.exit(1);
});
