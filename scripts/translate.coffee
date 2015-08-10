# Description:
#   Allows Hubot to know many languages.
#
# Commands:
#   hubot translate <phrase> - Google translate phrase into English
#   hubot translate|say to|in <lang> <phrase> - Google translate phrase from English into lang.
#   hubot translate|say from <source> to <target> <phrase> - Translates <phrase> from <source> into <target>. Both <source> and <target> are optional
#
# Author:
#   kengz
  
languages =
  "af": "Afrikaans",
  "sq": "Albanian",
  "ar": "Arabic",
  "az": "Azerbaijani",
  "eu": "Basque",
  "bn": "Bengali",
  "be": "Belarusian",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "zh-CN": "Chinese",
  "zh-TW": "Traditional Chinese",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "en": "English",
  "eo": "Esperanto",
  "et": "Estonian",
  "tl": "Filipino",
  "fi": "Finnish",
  "fr": "French",
  "gl": "Galician",
  "ka": "Georgian",
  "de": "German",
  "el": "Greek",
  "gu": "Gujarati",
  "ht": "Haitian Creole",
  "iw": "Hebrew",
  "hi": "Hindi",
  "hu": "Hungarian",
  "is": "Icelandic",
  "id": "Indonesian",
  "ga": "Irish",
  "it": "Italian",
  "ja": "Japanese",
  "kn": "Kannada",
  "ko": "Korean",
  "la": "Latin",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "mk": "Macedonian",
  "ms": "Malay",
  "mt": "Maltese",
  "no": "Norwegian",
  "fa": "Persian",
  "pl": "Polish",
  "pt": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "sr": "Serbian",
  "sk": "Slovak",
  "sl": "Slovenian",
  "es": "Spanish",
  "sw": "Swahili",
  "sv": "Swedish",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "vi": "Vietnamese",
  "cy": "Welsh",
  "yi": "Yiddish"

getCode = (language,languages) ->
  for code, lang of languages
      return code if lang.toLowerCase() is language.toLowerCase()

module.exports = (robot) ->
  language_choices = (language for _, language of languages).sort().join('|')
  pattern = new RegExp('(translate|say)(?: me)?' +
                       "(?: (?:from)? (#{language_choices}))?" +
                       "(?: (in|to) (#{language_choices}))?" +
                       '(.*)', 'i')
  robot.respond pattern, (msg) ->
    term   = "\"#{msg.match[5]?.trim()}\""
    origin = if msg.match[2] isnt undefined then getCode(msg.match[2], languages) else 'auto'
    target = if msg.match[4] isnt undefined then getCode(msg.match[4], languages) else 'en'

    msg.http("https://translate.google.com/translate_a/single")
      .query({
        client: 't'
        hl: 'en'
        sl: origin
        ssel: 0
        tl: target
        tsel: 0
        q: term
        ie: 'UTF-8'
        oe: 'UTF-8'
        otf: 1
        dt: ['bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't', 'at']
      })
      .header('User-Agent', 'Mozilla/5.0')
      .get() (err, res, body) ->
        if err
          msg.send "Failed to connect to GAPI"
          robot.emit 'error', err, res
          return

        try
          if body.length > 4 and body[0] == '['
            parsed = eval(body)
            language = languages[parsed[2]]
            parsed = parsed[0] and parsed[0][0] and parsed[0][0][0]
            parsed and= parsed.trim()
            if parsed
              if msg.match[4] is undefined
                msg.send "#{term} is #{language} for #{parsed}"
              else
                msg.send "The #{language} #{term} translates as #{parsed} in #{languages[target]}"
          else
            throw new SyntaxError 'Invalid JS code'

        catch err
          msg.send "Failed to parse GAPI response"
          robot.emit 'error', err
