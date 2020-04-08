const puppeteer = require('puppeteer');
const fs = require("fs");
let limit = process.argv.pop();
limit = parseInt(limit) || 1;
(async function run() {
    try {
        console.log(limit);
        if (limit <= 0) {
            process.exit();
        }
        console.log('正在注册');
        const browser = await puppeteer.launch({
            // headless: false,
            args: ['--proxy-server=http=127.0.0.1:1081'],
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(300000);
        // await page.goto('http://swanbc.com/app/0arLe1.html');
        // await page.setCookie({ name: 'tid', value: '112135', url: 'http://swanbc.com/', domain: '.swanbc.com' });
        await page.setCookie({ name: 'tid', value: '140444', url: 'http://swanbc.com/', domain: '.swanbc.com' });
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
                console.log('一分钟后重新注册');
                setTimeout(function() {
                    run();
                }, 1000 * 60);

            });
        } else {
            await browser.close();
            console.log(result);
            process.exit();
        }
    } catch (error) {
        console.log('出错啦，一分钟后重试', error);
        setTimeout(function() {
            run();
        }, 1000 * 60);
    }
})();

function getMoblieNum() {
    var numArray = new Array("139", "138", "137", "136", "135", "134", "159", "158", "157", "150", "151", "152", "188", "187", "182", "183", "184", "178", "130", "131", "132", "156", "155", "186", "185", "176", "133", "153", "189", "180", "181", "177"); //这是目前找到的除了数据卡外的手机卡前三位，类型是字符串数组
    var arraryLength = numArray.length;
    for (var n = 0; n < 10; n++) {
        var i = parseInt(Math.random() * arraryLength); //注意乘以的是上面numArray数组的长度，这样就可以取出数组中的随机一个数。random的取值范围是大于等于0.0，小于1.0，相乘后得到的就是0到（数组长度-1）的值。
        var num = numArray[i]; //取出随机的手机号前三位并赋值给num，手机号前三位是字符串类型的
        for (var j = 0; j < 8; j++) {
            num = num + Math.floor(Math.random() * 10); //num是字符串，后面的数字被当做字符串。所以变成两个字符串拼接了
        }
    }
    return num;
}

function createPwd() {
    var pwd_length = 10;
    var new_pwd = "";
    var j = 0;
    var char = '1234567890';
    for (var i = 0; i < parseInt(pwd_length); i++) {
        j = Math.floor(Math.random() * char.length);
        new_pwd += char.charAt(j);
    }
    return new_pwd;
};