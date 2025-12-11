const draws = [
    {
        title: 'Luxury Maldives Holiday',
        description: 'Win a 7-night stay at a 5-star resort in the Maldives. Includes flights and full board for two.',
        prize_description: '7-Night Maldives Trip',
        value: 8500,
        type: 'Holiday',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'active'
    },
    {
        title: 'Tech Bundle Giveaway',
        description: 'The ultimate tech upgrade! Win a MacBook Pro, iPad Air, and iPhone 15 Pro Max.',
        prize_description: 'Apple Tech Bundle',
        value: 4500,
        type: 'Physical Item',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'active'
    },
    {
        title: '£2,000 Cash Prize',
        description: 'Tax-free cash sent directly to your bank account. Spend it on whatever you like!',
        prize_description: '£2,000 Cash',
        value: 2000,
        type: 'Cash',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'active'
    }
];

async function seed() {
    try {
        console.log('Seeding data...');
        for (const draw of draws) {
            const res = await fetch('http://127.0.0.1:3000/api/draws', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draw)
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Failed to create ${draw.title}: ${err}`);
            }
            const data = await res.json();
            console.log(`Created: ${draw.title}`);
        }
        console.log('Done!');
    } catch (err) {
        console.error('Error seeding:', err.message);
    }
}

seed();
