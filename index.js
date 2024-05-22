import puppeteer from 'puppeteer';


//This scrapes emails from individual jobs for cold emailing purposes
(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://jobs.ge');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.screenshot({ type: 'png', path: 'screenshot-home.png' })



    let jobDetailsLinks = await page.$$eval(`tr > td:nth-child(2) > a:nth-child(1)`, anchors => {
        return anchors.map(a => a.href)
    })
    // console.log('links', jobDetailsLinks)
    // console.log(jobDetailsLinks[2])

    const emails = []

    for (let i = 0; i < jobDetailsLinks.length; i++) {
        const link = jobDetailsLinks[i];
        console.log(`Navigating to link: ${link}`);

        // Navigate to the link
        await page.goto(link);

        // Take a screenshot of the page
        // await page.screenshot({ type: 'png', path: `screenshot-${i}.png` });

        // Retrieve some text from the page (example: job title)
        const email = await page.$$eval('a[href^="mailto:"]', anchors => {
            return anchors.map(anchor => {
                const email = anchor.href.split(':')[1].split('?')[0]
                return decodeURIComponent(email).trim()
            });
        }); // Adjust the selector as needed
        // console.log(`Email: ${email}`);
        emails.push(email[0])


        // Optionally break the loop after a few iterations for testing
        if (i === 5) break;
    }
    // Wait and click on first result

    console.log(emails)

    await browser.close();
})();