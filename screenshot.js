const puppeteer = require('puppeteer');
const fs = require("fs");
(async function run() {
    console.log('正在注册');
    const browser = await puppeteer.launch({
        headless: false,
        // args: ['--proxy-server=http=127.0.0.1:1081'],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(300000);
    await page.setCookie({ name: 'tid', value: '112390', url: 'http://swanbc.com/', domain: '.swanbc.com' });
    await page.goto('http://swanbc.com/login/reg.php');
    // await page.waitForNavigation();
    const cellphone = getMoblieNum();
    const pwd = createPwd();

    await page.evaluate((cellphone, pwd) => {
        document.querySelector('input[name=username]').value = cellphone;
        document.querySelector('input[name=pwd]').value = pwd;
        document.querySelector('input[name=pwdtwo]').value = pwd;
        document.querySelector('input[type=submit]').click();
    }, cellphone, pwd);
    await page.waitForNavigation();
    const result = await page.mainFrame().$eval('.layui-m-layercont', ele => ele.innerHTML);
    if (result.indexOf('成功') >= 0) {
        const record = `${cellphone}/${pwd}\r\n`;
        const filename = 'account.txt';
        console.log('账号注册成功', record);
        fs.appendFile(filename, record, async err => {
            if (err) throw err;
            // await browser.close();
            console.log('账号保存成功', filename);
            limit -= 1;
            run();
        });
    } else {
        await browser.close();
        console.log(result);
    }
})();