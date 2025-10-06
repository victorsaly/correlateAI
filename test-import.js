import { promises as fs } from 'fs';
import path from 'path';

async function test() {
    console.log('✅ ES modules working');
    console.log('✅ fs.promises available');
    console.log('✅ path module available');
    
    // Test directory creation
    await fs.mkdir('test-dir', { recursive: true });
    console.log('✅ Directory creation works');
    
    // Test file writing
    await fs.writeFile('test-dir/test.json', '{"test": true}');
    console.log('✅ File writing works');
    
    // Cleanup
    await fs.rm('test-dir', { recursive: true, force: true });
    console.log('✅ Cleanup works');
}

test().then(() => {
    console.log('🎉 All basic operations successful');
}).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
