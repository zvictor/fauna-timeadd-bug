import sdk, {TimeUnit} from 'brainyduck'

const api = sdk()

const testIndex = async (indexName: string) => {
    const nextQueries = (await api.nextCrawlingQueries({indexName})).nextCrawlingQueries

    console.log(`\n\n========== TESTING INDEX '${indexName}' ==========\n`);
    console.log(`If the code works as it should, you will see a collection with keywords A and B.`);
    console.log(`But if you see an empty array, the code is not working as it should!\n`);
    console.log(`${indexName}:`, nextQueries.data);
}

;(async () => {
    // Create 3 CrawlingQuery documents
    await api.createCrawlingQuery({
        data: {
            keyword: 'A',
            schedule: {amount: 24, unit:TimeUnit.Hours}
        }
    })
    await api.createCrawlingQuery({
        data: {
            keyword: 'B',
            schedule: {amount: 24, unit:TimeUnit.Days}
        }
    })
    await api.createCrawlingQuery({
        data: {
            keyword: 'C',
            schedule: {amount: 24, unit:TimeUnit.Minutes},
            executions: [new Date()]
        }
    })

    // Test index `by_expiry`
    await testIndex(`by_expiry`)

    // Test index `by_expiry_hardcoded`
    await testIndex(`by_expiry_hardcoded`)
})()