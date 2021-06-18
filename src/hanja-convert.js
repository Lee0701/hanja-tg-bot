
const {buildDict, buildFreq} = require('./convert-dictionary')

const dic = buildDict('dic/hanja.txt')

const dic2Freq = buildFreq('dic/freq-hanja.txt')
const dic4Freq = buildFreq('dic/freq-hanjaeo.txt')

const search = (key) => (dic[key] || []).sort((a, b) => (dic4Freq[b] || dic2Freq[b] || 0) - (dic4Freq[a] || dic2Freq[a] || 0)).slice(0, 9)

const convertHanja = (str) => {
    if(str.includes(' ')) {
        const results = str.split(' ').map((word) => convertHanja(word))
        const firsts = results.slice(0, results.length - 1).map((result) => result[0]).join(' ')
        return results[results.length - 1].map((last) => firsts + ' ' + last)
    }
    let prefix = ''
    let results = []
    for(let i = 0; i < str.length; ) {
        let found = false
        const c = str.charAt(i)
        if(c >= '0' && c <= '9' && results.length) {
            const index = parseInt(c) - 1
            prefix += results[index % results.length]
            results = []
            i += 1
        } else if(!(c >= '가' && c <= '힣')) {
            // 이미 變換結果 目錄이 있는 境遇, 첫 候補를 選擇
            if(results.length) prefix += results[0]
            results = []
            prefix += c
            i++
            continue
        } else {
            for(let j = str.length; j > i; j--) {
                const key = str.slice(i, j)
                let result = search(key)
                if(result.length) {
                    // 이미 變換結果 目錄이 있는 境遇, 첫 候補를 選擇
                    if(results.length) prefix += results[0]
                    // 原本(한글) 候補도 追加
                    result.unshift(key)
                    // 結果中 아홉個만 取함
                    results = result.slice(0, 9)
                    i += j - i
                    found = true
                }
            }
            if(!found) {
                // 이미 變換結果 目錄이 있는 境遇, 첫 候補를 選擇
                if(results.length) prefix += results[0]
                results = []
                prefix += c
                i += 1
            }
        }
    }
    if(!results.length) results = ['']
    results = results.slice(0, 9)
    return results.map((result) => prefix + result)
}

module.exports = {convertHanja}
