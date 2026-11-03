
async function testApi() {
    try {
        console.log("Testing Production API (POST)...");
        const response = await fetch('https://mjre-portfolio.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello", mode: "standard" })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (error) {
        console.error("Error:", error);
    }
}

testApi();
