

const request = require('request')
const { JSDOM } = require('jsdom')


module.exports.executor = (event, context, callback) => {
  request('https://yushakobo.jp/shop/helix-keyboard-kit/', (e, response, body) => {
    if (e) {
      console.error(e)
    }

    try {
      const dom = new JSDOM(body);
      let statuses = []
      const stocks = dom.window.document.querySelectorAll('.stockstatus');
      stocks.forEach(function(item){
        statuses.push(item.children[1].children[1].innerHTML);
      })
      console.log(`${statuses}`);
      const filterd = statuses.filter(function(element, index, array) {
        return (element != '入荷待ち');
      });

      if (filterd.length !== 0) {
        request.post('https://slack.com/api/chat.postMessage',
            {
                form: {
                    token: process.env.SLACK_ACCESS_TOKEN,
                    channel: 'C8YD8G6TT',
                    username: '入荷待ちbot',
                    text: '@miyachik Helix入荷したかも?',
                    link_names: true
                }
            }
            , (error, response, body) => {
                console.log(error)
            }
        )
      }
    } catch (e) {
      console.error(e)
    }
  })
  const response = {
    statusCode: 200,
    body: "OK",
  };
  callback(null, response);
}
