(function () {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const baseAlphabetCharSet = new Set(baseAlphabet.split(''));
    const faAlphabet = [
        '\u0622', '\u0627', '\u0628', '\u067e', '\u062a', '\u062b', '\u062c', '\u0686',
        '\u062d', '\u062e', '\u062f', '\u0630', '\u0631', '\u0632', '\u0698', '\u0633',
        '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639', '\u063a', '\u0641',
        '\u0642', '\u06a9', '\u06af', '\u0644', '\u0645', '\u0646', '\u0648', '\u0647',
        '\u06cc', '\u0621', '\u0623', '\u0625', '\u0671', '\u0624', '\u0626', '\u0629',
        '\u06c0', '\u0649', '\u064a', '\u06d5', '\u06c2', '\u06c6', '\u06c7', '\u06c8',
        '\u06c9', '\u06d0', '\u06cd', '\u06ce', '\u06a4', '\u06a6', '\u06a7', '\u06a8',
        '\u06ac', '\u06ad', '\u06b3', '\u06b7', '\u06b5', '\u06b8', '\u06b9', '\u06ba'
    ];

    const OLGO_DATA = {"LEGACY_WORDS_64": ["\u0622\u0628", "\u0622\u0633\u0645\u0627\u0646", "\u0622\u062a\u0634", "\u0627\u0628\u0631", "\u0627\u0645\u06cc\u062f", "\u0627\u0646\u0633\u0627\u0646", "\u0627\u06cc\u0631\u0627\u0646", "\u0628\u0627\u062f", "\u0628\u0627\u0631\u0627\u0646", "\u0628\u0627\u063a", "\u0628\u0631\u0641", "\u0628\u0647\u0627\u0631", "\u067e\u0631\u0648\u0627\u0632", "\u067e\u0646\u062c\u0631\u0647", "\u067e\u06cc\u0627\u0645", "\u062a\u0644\u0627\u0634", "\u062a\u0648\u0633\u0639\u0647", "\u062c\u0627\u062f\u0647", "\u062c\u0647\u0627\u0646", "\u062d\u0642\u06cc\u0642\u062a", "\u062e\u0648\u0631\u0634\u06cc\u062f", "\u062f\u0631\u06cc\u0627", "\u062f\u0631\u062e\u062a", "\u062f\u0644", "\u062f\u0648\u0633\u062a", "\u0631\u0627\u0647", "\u0631\u0648\u062f", "\u0631\u0648\u06cc\u0627", "\u0631\u0648\u0632", "\u0632\u0645\u0627\u0646", "\u0632\u0645\u06cc\u0646", "\u0632\u06cc\u0628\u0627", "\u0633\u0641\u0631", "\u0633\u0644\u0627\u0645", "\u0633\u0646\u06af", "\u0633\u06a9\u0648\u062a", "\u0634\u0627\u062f\u06cc", "\u0634\u0628", "\u0635\u0628\u062d", "\u0635\u062f\u0627", "\u0637\u0628\u06cc\u0639\u062a", "\u0637\u0644\u0648\u0639", "\u0639\u0634\u0642", "\u0639\u0644\u0645", "\u0641\u0631\u062f\u0627", "\u0641\u0631\u0635\u062a", "\u0641\u0635\u0644", "\u0641\u06a9\u0631", "\u0642\u0644\u0645", "\u0642\u0644\u0628", "\u06a9\u0627\u0631", "\u06a9\u062a\u0627\u0628", "\u06a9\u0648\u0647", "\u06a9\u0648\u062f\u06a9", "\u06af\u0644", "\u0644\u0628\u062e\u0646\u062f", "\u0644\u062d\u0638\u0647", "\u0645\u0631\u062f\u0645", "\u0645\u0647\u0631", "\u0645\u0647\u062a\u0627\u0628", "\u0645\u0648\u062c", "\u0646\u0648\u0631", "\u0646\u06af\u0627\u0647", "\u0647\u062f\u0641", "\u0647\u0648\u0627", "\u06cc\u0627\u062f"], "LEGACY_WORDS_POOL": ["\u0632\u0646\u062f\u06af\u06cc", "\u0622\u0631\u0627\u0645\u0634", "\u0645\u062d\u0628\u062a", "\u0645\u0647\u0631\u0628\u0627\u0646\u06cc", "\u062f\u0648\u0633\u062a\u06cc", "\u0627\u0645\u0631\u0648\u0632", "\u0627\u06a9\u0646\u0648\u0646", "\u0622\u06cc\u0646\u062f\u0647", "\u0628\u0627\u0648\u0631", "\u0634\u0648\u0642", "\u0627\u0646\u06af\u06cc\u0632\u0647", "\u062a\u0648\u0627\u0646", "\u062d\u0631\u06a9\u062a", "\u0631\u0634\u062f", "\u067e\u06cc\u0634\u0631\u0641\u062a", "\u0627\u0646\u062f\u06cc\u0634\u0647", "\u062e\u0631\u062f", "\u062f\u0627\u0646\u0634", "\u0622\u06af\u0627\u0647\u06cc", "\u067e\u06cc\u0631\u0648\u0632\u06cc", "\u062a\u062c\u0631\u0628\u0647", "\u062a\u0645\u0631\u06cc\u0646", "\u062a\u0648\u062c\u0647", "\u0627\u0645\u062a\u062d\u0627\u0646", "\u067e\u0627\u06cc\u062f\u0627\u0631\u06cc", "\u06cc\u0627\u0631\u06cc", "\u0647\u0645\u0631\u0627\u0647", "\u0647\u0645\u0633\u0641\u0631", "\u0631\u0647\u0627\u06cc\u06cc", "\u0622\u063a\u0627\u0632", "\u067e\u0627\u06cc\u0627\u0646", "\u062e\u0627\u0637\u0631\u0647", "\u062f\u0627\u0633\u062a\u0627\u0646", "\u062a\u0635\u0648\u06cc\u0631", "\u0646\u0642\u0634", "\u0631\u0627\u0632", "\u062d\u0633", "\u0627\u062d\u0633\u0627\u0633", "\u062f\u06cc\u062f\u0627\u0631", "\u06af\u0641\u062a\u06af\u0648", "\u067e\u0631\u0633\u0634", "\u067e\u0627\u0633\u062e", "\u0622\u0648\u0627\u0632", "\u062a\u0631\u0627\u0646\u0647", "\u0646\u063a\u0645\u0647", "\u0631\u0646\u06af", "\u0639\u0637\u0631", "\u062e\u0627\u0646\u0647", "\u062e\u0627\u0646\u0648\u0627\u062f\u0647", "\u062f\u0648\u0627\u0645", "\u0645\u0633\u06cc\u0631", "\u0642\u062f\u0645", "\u06af\u0627\u0645", "\u0633\u0627\u062d\u0644", "\u0627\u0641\u0642", "\u0633\u067e\u06cc\u062f\u0647", "\u067e\u0631\u062a\u0648", "\u0631\u0648\u0634\u0646\u0627\u06cc\u06cc", "\u06af\u0631\u0645\u0627", "\u0646\u0633\u06cc\u0645", "\u0633\u0627\u06cc\u0647", "\u067e\u0646\u0627\u0647", "\u0633\u067e\u0627\u0633", "\u0644\u0628", "\u0686\u0634\u0645", "\u062f\u0633\u062a", "\u062e\u0646\u062f\u0647", "\u0644\u0628\u062e\u0646\u062f", "\u06cc\u0627\u062f\u06af\u0627\u0631", "\u0628\u06cc\u062f\u0627\u0631\u06cc", "\u0628\u062e\u0634\u0634", "\u0627\u0645\u0627\u0646\u062a", "\u0634\u06a9\u0648\u0641\u0647", "\u0622\u0628\u06cc", "\u0632\u0631\u06cc\u0646", "\u0633\u067e\u06cc\u062f", "\u0633\u0628\u0632", "\u0633\u0631\u062e", "\u0646\u0642\u0631\u0647", "\u0628\u0644\u0648\u0631", "\u0686\u0634\u0645\u0647", "\u062c\u0648\u06cc", "\u0622\u0628\u0634\u0627\u0631", "\u062f\u0634\u062a", "\u06a9\u0634\u062a\u0632\u0627\u0631", "\u067e\u0631\u0646\u062f\u0647", "\u0622\u0647\u0648", "\u0645\u0627\u0647", "\u0633\u062a\u0627\u0631\u0647", "\u062e\u0648\u0631\u0634\u06cc\u062f", "\u0635\u0628\u062d\u06af\u0627\u0647", "\u0634\u0627\u0645\u06af\u0627\u0647", "\u0628\u0627\u0631\u0642\u0647", "\u0622\u0630\u0631\u062e\u0634", "\u0631\u0639\u062f", "\u0628\u0631\u0642"], "LEGACY_EMOJI_POOL": ["\ud83d\ude00", "\ud83d\ude03", "\ud83d\ude04", "\ud83d\ude01", "\ud83d\ude06", "\ud83d\ude05", "\ud83d\ude02", "\ud83e\udd23", "\ud83d\ude42", "\ud83d\ude09", "\ud83d\ude0a", "\ud83d\ude07", "\ud83d\ude0d", "\ud83d\ude18", "\ud83d\ude17", "\ud83d\ude19", "\ud83d\ude1a", "\ud83d\ude0b", "\ud83d\ude1b", "\ud83d\ude1c", "\ud83d\ude1d", "\ud83d\ude0e", "\ud83e\udd13", "\ud83e\uddd0", "\ud83e\udd17", "\ud83e\udd14", "\ud83d\ude10", "\ud83d\ude11", "\ud83d\ude44", "\ud83d\ude2c", "\ud83d\ude0c", "\ud83d\ude14", "\ud83d\ude2a", "\ud83d\ude34", "\ud83e\udd73", "\ud83d\udc9b", "\ud83d\udc9a", "\ud83d\udc99", "\ud83d\udc9c", "\ud83e\udde1", "\ud83e\udd0d", "\ud83d\udda4", "\ud83d\udc98", "\ud83d\udc9d", "\ud83d\udc96", "\ud83d\udc97", "\ud83d\udc93", "\ud83d\udc9e", "\ud83d\udc95", "\ud83d\udc9f", "\u2763", "\ud83d\udcaf", "\u2728", "\ud83c\udf1f", "\u2b50", "\u26a1", "\ud83d\udd25", "\ud83d\udca7", "\ud83c\udf08", "\ud83c\udf19", "\ud83c\udf0d", "\ud83c\udf0e", "\ud83c\udf0f", "\ud83c\udf38", "\ud83c\udf3c", "\ud83c\udf3b", "\ud83c\udf3a", "\ud83c\udf37", "\ud83c\udf39", "\ud83e\udd40", "\ud83c\udf3f", "\ud83c\udf40", "\ud83c\udf31", "\ud83c\udf33", "\ud83c\udf32", "\ud83c\udf34", "\ud83c\udf35", "\ud83c\udf41", "\ud83c\udf42", "\ud83c\udf43", "\ud83c\udf0a", "\u26f0", "\ud83c\udfd4", "\ud83c\udfd5", "\ud83c\udf88", "\ud83c\udf89", "\ud83c\udf8a", "\ud83c\udf81", "\ud83c\udfc6", "\ud83c\udfaf", "\ud83c\udfb5", "\ud83c\udfb6", "\ud83d\udccc", "\ud83d\udccd", "\ud83e\udded", "\u23f0", "\ud83d\udcc5", "\ud83d\udcdd", "\ud83d\udcda", "\ud83d\udcd6", "\u270f", "\ud83e\udde0", "\ud83d\udd11", "\ud83d\udd12", "\ud83d\udd13", "\ud83d\udee1", "\u2699", "\ud83d\udd27", "\ud83d\udd28", "\ud83e\uddf0", "\ud83d\udd2c", "\ud83d\udca1", "\ud83d\udd26", "\ud83d\udcf7", "\ud83c\udfa5", "\ud83d\udcf1", "\ud83d\udcbb", "\ud83d\udda5", "\ud83d\udef0", "\ud83d\ude80", "\u2708", "\ud83d\ude97", "\ud83d\udeb2", "\ud83d\udeb6", "\ud83c\udfc3", "\ud83e\uddd8", "\ud83e\udd1d", "\ud83d\udc4f", "\ud83d\ude4c", "\ud83d\ude4f", "\ud83c\udf1e", "\u2600", "\u2601", "\ud83c\udf27", "\u2744", "\ud83c\udf28", "\u26c5", "\u26c8", "\ud83c\udf26", "\ud83c\udf24"], "PERSIAN_MAP": {"0": "\u06f0", "1": "\u06f1", "2": "\u06f2", "3": "\u06f3", "4": "\u06f4", "5": "\u06f5", "6": "\u06f6", "7": "\u06f7", "8": "\u06f8", "9": "\u06f9", "a": "\u0634", "b": "\u0628", "c": "\u062b", "d": "\u062f", "e": "\u0639", "f": "\u0641", "g": "\u06af", "h": "\u0647", "i": "\u06cc", "j": "\u062c", "k": "\u06a9", "l": "\u0644", "m": "\u0645", "n": "\u0646", "o": "\u062e", "p": "\u067e", "q": "\u0642", "r": "\u0631", "s": "\u0633", "t": "\u062a", "u": "\u0636", "v": "\u0648", "w": "\u0635", "x": "\u0637", "y": "\u0638", "z": "\u0632", ":": "\u0686", "/": "\u0622", ".": "\u0698", "-": "\u0630", "_": "\u0626", "+": "\u0621", "=": "\u0623", "?": "\u0624", "&": "\u0625", "#": "\u064b", "@": "\u064d", "%": "\u064c", " ": " ", "\n": "\n"}, "BYTE_WORDS": ["\u0627\u062d\u0645\u062f", "\u0639\u0644\u06cc", "\u062d\u0633\u0646", "\u0645\u062d\u0645\u062f", "\u0631\u0636\u0627", "\u0645\u0647\u062f\u06cc", "\u0627\u0645\u06cc\u0631", "\u0633\u0639\u06cc\u062f", "\u0641\u0627\u0637\u0645\u0647", "\u0632\u0647\u0631\u0627", "\u0645\u0631\u06cc\u0645", "\u0633\u0627\u0631\u0627", "\u0646\u0631\u06af\u0633", "\u0644\u06cc\u0644\u0627", "\u0646\u0627\u0632\u0646\u06cc\u0646", "\u0645\u06cc\u0646\u0627", "\u062a\u0647\u0631\u0627\u0646", "\u0634\u06cc\u0631\u0627\u0632", "\u0627\u0635\u0641\u0647\u0627\u0646", "\u0645\u0634\u0647\u062f", "\u062a\u0628\u0631\u06cc\u0632", "\u06a9\u0631\u062c", "\u0642\u0645", "\u0627\u0647\u0648\u0627\u0632", "\u0628\u0647\u0627\u0631", "\u062a\u0627\u0628\u0633\u062a\u0627\u0646", "\u067e\u0627\u06cc\u06cc\u0632", "\u0632\u0645\u0633\u062a\u0627\u0646", "\u0634\u0646\u0628\u0647", "\u06cc\u06a9\u0634\u0646\u0628\u0647", "\u062f\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u200c\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067e\u0646\u062c\u200c\u0634\u0646\u0628\u0647", "\u062c\u0645\u0639\u0647", "\u0635\u0628\u062d", "\u0638\u0647\u0631", "\u0639\u0635\u0631", "\u0634\u0628", "\u0641\u0631\u062f\u0627", "\u062f\u06cc\u0631\u0648\u0632", "\u0627\u0645\u0631\u0648\u0632", "\u0647\u0641\u062a\u0647", "\u0645\u0627\u0647", "\u0633\u0627\u0644", "\u0642\u0631\u0646", "\u0644\u062d\u0638\u0647", "\u062b\u0627\u0646\u06cc\u0647", "\u062f\u0642\u06cc\u0642\u0647", "\u0633\u0627\u0639\u062a", "\u0631\u0648\u0632", "\u0634\u0631\u0648\u0639", "\u067e\u0627\u06cc\u0627\u0646", "\u0648\u0633\u0637", "\u06a9\u0646\u0627\u0631", "\u0628\u0627\u0644\u0627", "\u067e\u0627\u06cc\u06cc\u0646", "\u0686\u067e", "\u0631\u0627\u0633\u062a", "\u062c\u0644\u0648", "\u0639\u0642\u0628", "\u062f\u0627\u062e\u0644", "\u062e\u0627\u0631\u062c", "\u062f\u0648\u0631", "\u06a9\u062a\u0627\u0628", "\u0642\u0644\u0645", "\u06a9\u0627\u063a\u0630", "\u062f\u0641\u062a\u0631", "\u0645\u06cc\u0632", "\u0635\u0646\u062f\u0644\u06cc", "\u062a\u062e\u062a", "\u06a9\u0645\u062f", "\u062f\u0631\u0628", "\u067e\u0646\u062c\u0631\u0647", "\u062f\u06cc\u0648\u0627\u0631", "\u0633\u0642\u0641", "\u06a9\u0641", "\u067e\u0644\u0647", "\u0622\u0633\u0627\u0646\u0633\u0648\u0631", "\u0631\u0627\u0647\u0631\u0648", "\u0622\u0634\u067e\u0632\u062e\u0627\u0646\u0647", "\u0627\u062a\u0627\u0642", "\u062d\u0645\u0627\u0645", "\u062a\u0648\u0627\u0644\u062a", "\u062d\u06cc\u0627\u0637", "\u0628\u0627\u0644\u06a9\u0646", "\u067e\u0627\u0631\u06a9\u06cc\u0646\u06af", "\u0627\u0646\u0628\u0627\u0631\u06cc", "\u0645\u0627\u0634\u06cc\u0646", "\u0645\u0648\u062a\u0648\u0631", "\u062f\u0648\u0686\u0631\u062e\u0647", "\u0627\u062a\u0648\u0628\u0648\u0633", "\u0645\u062a\u0631\u0648", "\u0642\u0637\u0627\u0631", "\u0647\u0648\u0627\u067e\u06cc\u0645\u0627", "\u06a9\u0634\u062a\u06cc", "\u06af\u0648\u0634\u06cc", "\u0644\u067e\u062a\u0627\u067e", "\u06a9\u0627\u0645\u067e\u06cc\u0648\u062a\u0631", "\u062a\u0644\u0648\u06cc\u0632\u06cc\u0648\u0646", "\u0631\u0627\u062f\u06cc\u0648", "\u06cc\u062e\u0686\u0627\u0644", "\u0627\u062c\u0627\u0642", "\u0645\u0627\u06a9\u0631\u0648\u0648\u06cc\u0648", "\u0644\u0628\u0627\u0633", "\u0634\u0644\u0648\u0627\u0631", "\u067e\u06cc\u0631\u0627\u0647\u0646", "\u06a9\u062a", "\u06a9\u0641\u0634", "\u062c\u0648\u0631\u0627\u0628", "\u06a9\u0644\u0627\u0647", "\u0634\u0627\u0644", "\u0639\u06cc\u0646\u06a9", "\u0633\u0627\u0639\u062a", "\u06a9\u06cc\u0641", "\u06a9\u0645\u0631\u0628\u0646\u062f", "\u062f\u0633\u062a\u0628\u0646\u062f", "\u06af\u0631\u062f\u0646\u0628\u0646\u062f", "\u0627\u0646\u06af\u0634\u062a\u0631", "\u06af\u0648\u0634\u0648\u0627\u0631\u0647", "\u0633\u06cc\u0628", "\u067e\u0631\u062a\u0642\u0627\u0644", "\u0645\u0648\u0632", "\u0627\u0646\u06af\u0648\u0631", "\u0647\u0646\u062f\u0648\u0627\u0646\u0647", "\u062e\u0631\u0628\u0632\u0647", "\u06af\u06cc\u0644\u0627\u0633", "\u0622\u0644\u0628\u0627\u0644\u0648", "\u0628\u0632\u0631\u06af", "\u06a9\u0648\u0686\u06a9", "\u0628\u0644\u0646\u062f", "\u06a9\u0648\u062a\u0627\u0647", "\u067e\u0647\u0646", "\u0628\u0627\u0631\u06cc\u06a9", "\u0636\u062e\u06cc\u0645", "\u0646\u0627\u0632\u06a9", "\u0633\u0646\u06af\u06cc\u0646", "\u0633\u0628\u06a9", "\u062a\u0646\u062f", "\u06a9\u0646\u062f", "\u06af\u0631\u0645", "\u0633\u0631\u062f", "\u062f\u0627\u063a", "\u062e\u0646\u06a9", "\u0646\u0631\u0645", "\u0633\u062e\u062a", "\u0635\u0627\u0641", "\u0646\u0627\u0647\u0645\u0648\u0627\u0631", "\u062a\u0645\u06cc\u0632", "\u06a9\u062b\u06cc\u0641", "\u062e\u0634\u06a9", "\u0645\u0631\u0637\u0648\u0628", "\u062a\u0627\u0632\u0647", "\u06a9\u0647\u0646\u0647", "\u062c\u062f\u06cc\u062f", "\u0642\u062f\u06cc\u0645\u06cc", "\u0631\u0648\u0634\u0646", "\u062a\u0627\u0631\u06cc\u06a9", "\u0631\u0646\u06af\u06cc", "\u0633\u0641\u06cc\u062f", "\u0633\u06cc\u0627\u0647", "\u0642\u0631\u0645\u0632", "\u0622\u0628\u06cc", "\u0633\u0628\u0632", "\u0632\u0631\u062f", "\u0646\u0627\u0631\u0646\u062c\u06cc", "\u0628\u0646\u0641\u0634", "\u0635\u0648\u0631\u062a\u06cc", "\u062e\u0648\u0628", "\u0628\u062f", "\u0639\u0627\u0644\u06cc", "\u0628\u06cc\u0645\u0627\u0631", "\u0633\u0627\u0644\u0645", "\u0642\u0648\u06cc", "\u0636\u0639\u06cc\u0641", "\u0632\u06cc\u0628\u0627", "\u0631\u0641\u062a", "\u0622\u0645\u062f", "\u062f\u06cc\u062f", "\u0634\u0646\u06cc\u062f", "\u06af\u0641\u062a", "\u062e\u0648\u0631\u062f", "\u062e\u0648\u0627\u0628\u06cc\u062f", "\u0646\u0634\u0633\u062a", "\u0627\u06cc\u0633\u062a\u0627\u062f", "\u062f\u0648\u06cc\u062f", "\u067e\u0631\u06cc\u062f", "\u0627\u0641\u062a\u0627\u062f", "\u06af\u0631\u0641\u062a", "\u062f\u0627\u062f", "\u0628\u0631\u062f", "\u0622\u0648\u0631\u062f", "\u06cc\u06a9\u06cc", "\u062f\u0648\u062a\u0627", "\u0633\u0647\u200c\u062a\u0627", "\u0686\u0647\u0627\u0631\u062a\u0627", "\u067e\u0646\u062c\u062a\u0627", "\u0634\u0634\u200c\u062a\u0627", "\u0647\u0641\u062a\u200c\u062a\u0627", "\u0647\u0634\u062a\u200c\u062a\u0627", "\u0646\u0647\u200c\u062a\u0627", "\u062f\u0647\u200c\u062a\u0627", "\u0628\u06cc\u0633\u062a", "\u0633\u06cc", "\u0686\u0647\u0644", "\u067e\u0646\u062c\u0627\u0647", "\u0634\u0635\u062a", "\u0647\u0641\u062a\u0627\u062f", "\u0647\u0634\u062a\u0627\u062f", "\u0646\u0648\u062f", "\u0635\u062f", "\u0647\u0632\u0627\u0631", "\u0645\u06cc\u0644\u06cc\u0648\u0646", "\u0627\u0648\u0644", "\u062f\u0648\u0645", "\u0633\u0648\u0645", "\u0622\u062e\u0631", "\u0628\u0639\u062f", "\u0642\u0628\u0644", "\u0647\u0645\u0647", "\u0647\u06cc\u0686", "\u0628\u0639\u0636\u06cc", "\u0647\u0631", "\u0627\u06cc\u0646", "\u0622\u0646", "\u0627\u06cc\u0646\u062c\u0627", "\u0622\u0646\u062c\u0627", "\u06a9\u062c\u0627", "\u0686\u0647", "\u06a9\u06cc", "\u0686\u0631\u0627", "\u0686\u0637\u0648\u0631", "\u0628\u0644\u0647", "\u062e\u06cc\u0631", "\u0634\u0627\u06cc\u062f", "\u062d\u062a\u0645\u0627", "\u0647\u0631\u06af\u0632", "\u0647\u0645\u06cc\u0634\u0647", "\u06af\u0627\u0647\u06cc", "\u0627\u063a\u0644\u0628", "\u0632\u0648\u062f", "\u062f\u06cc\u0631", "\u0627\u0644\u0627\u0646", "\u0628\u0639\u062f\u0627", "\u0642\u0628\u0644\u0627", "\u0628\u0627\u0632", "\u0628\u0633\u062a\u0647", "\u067e\u0631", "\u062e\u0627\u0644\u06cc", "\u06a9\u0645", "\u0632\u06cc\u0627\u062f", "\u0646\u0635\u0641", "\u0631\u0628\u0639", "\u06a9\u0627\u0645\u0644", "\u0646\u0627\u0642\u0635", "\u0622\u0645\u0627\u062f\u0647"], "SMS_WORDS_64": ["\u06a9\u0647", "\u0628\u0627", "\u0627\u0632", "\u0628\u0647", "\u062a\u0627", "\u062f\u0631", "\u06cc\u06a9", "\u062f\u0648", "\u0647\u0645", "\u0634\u062f", "\u0631\u0648", "\u0686\u06cc", "\u06a9\u0648", "\u06a9\u06cc", "\u0686\u0647", "\u0646\u0647", "\u0645\u0646", "\u062a\u0648", "\u0627\u0648", "\u0645\u0627", "\u0634\u0628", "\u062f\u0644", "\u0633\u0631", "\u067e\u0627", "\u0622\u0628", "\u06af\u0644", "\u062e\u0628", "\u0628\u062f", "\u06a9\u0645", "\u0647\u06cc", "\u0622\u0646", "\u0648\u06cc", "\u0628\u0631\u0648", "\u0628\u06cc\u0627", "\u062e\u0648\u0628", "\u0628\u0644\u0647", "\u0646\u06af\u0648", "\u0628\u06af\u0648", "\u0686\u0631\u0627", "\u0627\u06af\u0631", "\u0647\u0633\u062a", "\u0646\u06cc\u0633\u062a", "\u0634\u062f\u0647", "\u06a9\u0631\u062f", "\u06af\u0641\u062a", "\u0631\u0641\u062a", "\u06a9\u0627\u0631", "\u062e\u0628\u0631", "\u06cc\u06a9\u06cc", "\u0647\u0645\u0647", "\u0686\u0646\u062f", "\u0627\u0648\u0646", "\u0627\u06cc\u0646", "\u0628\u0648\u062f", "\u0634\u0648\u062f", "\u06a9\u0646\u0645", "\u0645\u06cc\u0627\u0645", "\u0645\u06cc\u0631\u0645", "\u062f\u06cc\u06af\u0647", "\u0628\u0627\u0634\u0647", "\u062e\u0648\u0646\u0647", "\u0641\u0631\u062f\u0627", "\u0627\u0645\u0631\u0648\u0632", "\u0633\u0644\u0627\u0645"], "STEALTH_TEMPLATES": ["\u06a9\u06cc\u0648 \u06a9\u06cc\u0648 \u06a9\u06cc\u0648 \u06a9\u0648\u06cc \u06a9\u0648\u06cc \u0647\u06cc \u0647\u06cc \u06cc\u06a9\u06cc \u06cc\u06a9\u06cc \u06a9\u0648", "\u06a9\u0648 \u06a9\u06cc \u06cc\u06a9\u06cc \u06a9\u0648\u06cc \u0647\u06cc \u0648\u06cc \u06a9\u0648\u06a9\u0648 \u06cc\u06a9\u06cc \u06a9\u06cc \u0647\u06cc", "\u06cc\u06a9\u06cc \u06a9\u0648\u06a9\u0648 \u06a9\u06cc \u06a9\u06cc \u06cc\u06a9\u06cc \u06a9\u0648\u06cc \u0647\u06cc \u0648\u06cc \u06a9\u0648", "\u06a9\u06cc\u06a9\u0648 \u06a9\u06cc\u06a9\u0648 \u0647\u06cc \u06cc\u06a9\u06cc \u06a9\u0648\u06cc \u06a9\u0648\u06cc \u0648\u06cc \u0647\u06cc", "\u0647\u06cc \u06a9\u06cc \u06a9\u0648 \u06cc\u06a9\u06cc \u06cc\u06a9\u06cc \u06a9\u0648\u06cc \u06a9\u0648\u06cc \u0648\u06cc \u0647\u06cc", "\u06a9\u0648 \u06a9\u0648 \u06cc\u06a9\u06cc \u06a9\u06cc \u06a9\u06cc \u0647\u06cc \u0647\u06cc \u0648\u06cc \u0648\u06cc \u06a9\u0648\u06cc", "\u06cc\u06a9\u06cc \u06cc\u06a9\u06cc \u06a9\u0648\u06a9\u0648 \u0647\u06cc \u06a9\u06cc \u0648\u06cc \u06a9\u0648\u06cc \u06a9\u0648\u06cc", "\u06a9\u06cc \u06a9\u06cc \u06a9\u0648 \u06a9\u0648 \u06cc\u0647 \u06cc\u0647 \u0647\u06cc \u0647\u06cc \u0648\u06cc \u0648\u06cc \u06cc\u06a9\u06cc"], "HOMOGLYPH_PAIRS": [["\u06a9", "\u0643"], ["\u06cc", "\u064a"], ["\u0647", "\u06d5"], ["\u0648", "\u06c6"]], "EMOJI_ENCODE_GROUPS": [["\ud83d\ude0a", "\ud83d\ude42", "\ud83d\ude03", "\ud83d\ude04"], ["\ud83d\udc99", "\ud83d\udc9a", "\ud83d\udc9b", "\ud83d\udc9c"], ["\ud83d\udc4d", "\ud83d\udc4c", "\ud83e\udd1d", "\ud83e\udd1e"], ["\ud83c\udf38", "\ud83c\udf3a", "\ud83c\udf39", "\ud83c\udf37"]], "FINGLISH_WORDS": [{"variants": ["salam", "salaam", "slm", "sallam"], "meaning": "\u0633\u0644\u0627\u0645"}, {"variants": ["khoob", "khub", "khoub", "khob"], "meaning": "\u062e\u0648\u0628"}, {"variants": ["chetori", "chetory", "chetoori", "chetowri"], "meaning": "\u0686\u0637\u0648\u0631\u06cc"}, {"variants": ["mersi", "merci", "mamnoon", "mamnun"], "meaning": "\u0645\u0645\u0646\u0648\u0646"}, {"variants": ["hasti", "hasty", "hesti", "hesty"], "meaning": "\u0647\u0633\u062a\u06cc"}, {"variants": ["mikham", "mikhaam", "mikhwam", "mikhaham"], "meaning": "\u0645\u06cc\u062e\u0648\u0627\u0645"}, {"variants": ["miram", "mirm", "meerom", "miraam"], "meaning": "\u0645\u06cc\u0631\u0645"}, {"variants": ["beram", "bram", "berim", "brim"], "meaning": "\u0628\u0631\u0645"}, {"variants": ["koja", "kja", "kuja", "kojaa"], "meaning": "\u06a9\u062c\u0627"}, {"variants": ["alan", "alaan", "hala", "halaa"], "meaning": "\u0627\u0644\u0627\u0646"}, {"variants": ["farda", "fardaa", "frd", "frda"], "meaning": "\u0641\u0631\u062f\u0627"}, {"variants": ["dirooz", "dirouz", "diruz", "diroz"], "meaning": "\u062f\u06cc\u0631\u0648\u0632"}, {"variants": ["emrooz", "emruz", "imruz", "emroz"], "meaning": "\u0627\u0645\u0631\u0648\u0632"}, {"variants": ["shab", "shb", "shob", "shub"], "meaning": "\u0634\u0628"}, {"variants": ["sobh", "sobeh", "sob", "subh"], "meaning": "\u0635\u0628\u062d"}, {"variants": ["doost", "dust", "dost", "doust"], "meaning": "\u062f\u0648\u0633\u062a"}, {"variants": ["khabar", "khabr", "xabar", "khabari"], "meaning": "\u062e\u0628\u0631"}, {"variants": ["bache", "bacheh", "bche", "baache"], "meaning": "\u0628\u0686\u0647"}, {"variants": ["maman", "mamaan", "madar", "maadar"], "meaning": "\u0645\u0627\u0645\u0627\u0646"}, {"variants": ["baba", "babaa", "pedar", "pedaar"], "meaning": "\u0628\u0627\u0628\u0627"}, {"variants": ["khone", "khune", "khoone", "khooneh"], "meaning": "\u062e\u0648\u0646\u0647"}, {"variants": ["mashine", "mashin", "machine", "machin"], "meaning": "\u0645\u0627\u0634\u06cc\u0646"}, {"variants": ["telefon", "telefn", "telifon", "phone"], "meaning": "\u062a\u0644\u0641\u0646"}, {"variants": ["kar", "kaar", "kr", "karr"], "meaning": "\u06a9\u0627\u0631"}, {"variants": ["pool", "pul", "poul", "poool"], "meaning": "\u067e\u0648\u0644"}, {"variants": ["ghaza", "ghazaa", "qaza", "qazaa"], "meaning": "\u063a\u0630\u0627"}, {"variants": ["chai", "chaay", "chay", "chaaee"], "meaning": "\u0686\u0627\u06cc"}, {"variants": ["ab", "aab", "aabe", "abe"], "meaning": "\u0622\u0628"}, {"variants": ["havaa", "hava", "hva", "hawaa"], "meaning": "\u0647\u0648\u0627"}, {"variants": ["ruz", "rooz", "roz", "rouz"], "meaning": "\u0631\u0648\u0632"}, {"variants": ["age", "agar", "ageh", "agr"], "meaning": "\u0627\u06af\u0647"}, {"variants": ["vali", "valy", "wali", "ammaa"], "meaning": "\u0648\u0644\u06cc"}, {"variants": ["aslan", "aslaan", "asln", "aslan"], "meaning": "\u0627\u0635\u0644\u0627"}, {"variants": ["hatman", "hatmann", "hatmn", "htman"], "meaning": "\u062d\u062a\u0645\u0627"}, {"variants": ["fekr", "fikr", "fkr", "feekr"], "meaning": "\u0641\u06a9\u0631"}, {"variants": ["eshgh", "eshq", "ishgh", "ishq"], "meaning": "\u0639\u0634\u0642"}, {"variants": ["delam", "dilam", "delm", "dilm"], "meaning": "\u062f\u0644\u0645"}, {"variants": ["yadet", "yaadet", "yaadt", "yadt"], "meaning": "\u06cc\u0627\u062f\u062a"}, {"variants": ["miduni", "miduny", "midooni", "midoony"], "meaning": "\u0645\u06cc\u062f\u0648\u0646\u06cc"}, {"variants": ["nemidun", "nmidon", "nemidoon", "nemidunam"], "meaning": "\u0646\u0645\u06cc\u062f\u0648\u0646\u0645"}, {"variants": ["bebin", "bebeen", "bebn", "bbeen"], "meaning": "\u0628\u0628\u06cc\u0646"}, {"variants": ["begoo", "begu", "begou", "bgo"], "meaning": "\u0628\u06af\u0648"}, {"variants": ["biyaa", "biya", "bia", "biaa"], "meaning": "\u0628\u06cc\u0627"}, {"variants": ["boro", "bro", "berow", "brow"], "meaning": "\u0628\u0631\u0648"}, {"variants": ["bashe", "baashe", "bshe", "basheh"], "meaning": "\u0628\u0627\u0634\u0647"}, {"variants": ["nist", "neest", "nst", "niist"], "meaning": "\u0646\u06cc\u0633\u062a"}, {"variants": ["hast", "haast", "hst", "hasst"], "meaning": "\u0647\u0633\u062a"}, {"variants": ["dare", "daareh", "dareh", "dre"], "meaning": "\u062f\u0627\u0631\u0647"}, {"variants": ["nadare", "nadareh", "ndareh", "nadre"], "meaning": "\u0646\u062f\u0627\u0631\u0647"}, {"variants": ["rafti", "rafty", "rfti", "raftii"], "meaning": "\u0631\u0641\u062a\u06cc"}, {"variants": ["omadi", "oomadi", "omdy", "oomdy"], "meaning": "\u0627\u0648\u0645\u062f\u06cc"}, {"variants": ["didi", "didii", "ddy", "didee"], "meaning": "\u062f\u06cc\u062f\u06cc"}, {"variants": ["gofti", "gofty", "gfti", "goftii"], "meaning": "\u06af\u0641\u062a\u06cc"}, {"variants": ["shenidi", "shenidy", "shnidi", "shnidy"], "meaning": "\u0634\u0646\u06cc\u062f\u06cc"}, {"variants": ["kardi", "kardy", "krdi", "kardii"], "meaning": "\u06a9\u0631\u062f\u06cc"}, {"variants": ["khasti", "khasty", "xasti", "khastii"], "meaning": "\u062e\u0633\u062a\u0647\u200c\u0627\u06cc"}, {"variants": ["gorosne", "gorosneh", "gorosna", "grosne"], "meaning": "\u06af\u0631\u0633\u0646\u0647"}, {"variants": ["teshne", "teshneh", "tshne", "teshnaa"], "meaning": "\u062a\u0634\u0646\u0647"}, {"variants": ["khosh", "xosh", "khsh", "khossh"], "meaning": "\u062e\u0648\u0634"}, {"variants": ["narahat", "narahaat", "nrahat", "nrahaat"], "meaning": "\u0646\u0627\u0631\u0627\u062d\u062a"}, {"variants": ["asabi", "asabii", "asaby", "asabani"], "meaning": "\u0639\u0635\u0628\u0627\u0646\u06cc"}, {"variants": ["inja", "injaa", "enja", "eenja"], "meaning": "\u0627\u06cc\u0646\u062c\u0627"}, {"variants": ["onja", "ounjaa", "oonja", "unja"], "meaning": "\u0627\u0648\u0646\u062c\u0627"}, {"variants": ["chikar", "chikaar", "chkar", "chekar"], "meaning": "\u0686\u06cc\u06a9\u0627\u0631"}, {"variants": ["baraye", "baraaye", "baraye", "baray"], "meaning": "\u0628\u0631\u0627\u06cc"}, {"variants": ["haminja", "haminjaa", "hminja", "haminj"], "meaning": "\u0647\u0645\u06cc\u0646\u062c\u0627"}, {"variants": ["onam", "oonam", "unam", "ounam"], "meaning": "\u0627\u0648\u0646\u0645"}, {"variants": ["inam", "eenam", "inm", "iinam"], "meaning": "\u0627\u06cc\u0646\u0645"}, {"variants": ["faghat", "faqat", "fghat", "faqt"], "meaning": "\u0641\u0642\u0637"}, {"variants": ["hamishe", "hamisheh", "hmshe", "hamisha"], "meaning": "\u0647\u0645\u06cc\u0634\u0647"}, {"variants": ["hichvaght", "hichvaqt", "hchvght", "hichvaqht"], "meaning": "\u0647\u06cc\u0686\u0648\u0642\u062a"}, {"variants": ["shayad", "shaayad", "shyd", "shaiad"], "meaning": "\u0634\u0627\u06cc\u062f"}, {"variants": ["albate", "albatte", "albte", "albateh"], "meaning": "\u0627\u0644\u0628\u062a\u0647"}, {"variants": ["ehtemalan", "ehtemaaln", "ehtmalan", "ihtmalan"], "meaning": "\u0627\u062d\u062a\u0645\u0627\u0644\u0627"}, {"variants": ["ziad", "ziyad", "zyd", "ziaad"], "meaning": "\u0632\u06cc\u0627\u062f"}, {"variants": ["kam", "kamm", "km", "kaam"], "meaning": "\u06a9\u0645"}, {"variants": ["kheili", "kheyli", "khyli", "khili"], "meaning": "\u062e\u06cc\u0644\u06cc"}, {"variants": ["yekam", "yekaam", "yekm", "ykam"], "meaning": "\u06cc\u06a9\u0645"}, {"variants": ["tamum", "tamoom", "tmum", "tamoum"], "meaning": "\u062a\u0645\u0648\u0645"}, {"variants": ["shoru", "shoroo", "shro", "shorou"], "meaning": "\u0634\u0631\u0648\u0639"}, {"variants": ["akhar", "aakhar", "akhr", "aakhaar"], "meaning": "\u0622\u062e\u0631"}, {"variants": ["aval", "avval", "awwal", "awall"], "meaning": "\u0627\u0648\u0644"}, {"variants": ["baad", "bad", "baade", "baaden"], "meaning": "\u0628\u0639\u062f"}, {"variants": ["ghabl", "qabl", "ghbl", "qbl"], "meaning": "\u0642\u0628\u0644"}, {"variants": ["alan", "aalaan", "aln", "alaan"], "meaning": "\u0627\u0644\u0627\u0646"}, {"variants": ["baadan", "baadaan", "baadn", "badn"], "meaning": "\u0628\u0639\u062f\u0627"}, {"variants": ["digar", "digeh", "dige", "digaar"], "meaning": "\u062f\u06cc\u06af\u0647"}, {"variants": ["behtare", "behtareh", "bhtare", "behtar"], "meaning": "\u0628\u0647\u062a\u0631\u0647"}, {"variants": ["badtare", "badtareh", "bdtare", "badtar"], "meaning": "\u0628\u062f\u062a\u0631\u0647"}, {"variants": ["mitooni", "mitoony", "mitouni", "mituni"], "meaning": "\u0645\u06cc\u062a\u0648\u0646\u06cc"}, {"variants": ["nemitooni", "nemitoony", "nmitooni", "nmituni"], "meaning": "\u0646\u0645\u06cc\u062a\u0648\u0646\u06cc"}, {"variants": ["bayad", "baayad", "byd", "baiad"], "meaning": "\u0628\u0627\u06cc\u062f"}, {"variants": ["nabayad", "nabaayad", "nbyd", "nabaiad"], "meaning": "\u0646\u0628\u0627\u06cc\u062f"}, {"variants": ["mikham", "mikhaam", "mkhm", "mikhm"], "meaning": "\u0645\u06cc\u062e\u0648\u0627\u0645"}, {"variants": ["nemikham", "nemikhaam", "nmkhm", "nmikhaam"], "meaning": "\u0646\u0645\u06cc\u062e\u0648\u0627\u0645"}, {"variants": ["mishe", "misheh", "mshe", "mishah"], "meaning": "\u0645\u06cc\u0634\u0647"}, {"variants": ["nemishe", "nemisheh", "nmshe", "nmishah"], "meaning": "\u0646\u0645\u06cc\u0634\u0647"}, {"variants": ["cheghad", "cheqad", "chghd", "cheqadr"], "meaning": "\u0686\u0642\u062f\u0631"}, {"variants": ["chand", "chnd", "chaand", "channd"], "meaning": "\u0686\u0646\u062f"}, {"variants": ["kodum", "kodoom", "kodom", "kudum"], "meaning": "\u06a9\u062f\u0648\u0645"}, {"variants": ["kasi", "kasy", "ksi", "kasii"], "meaning": "\u06a9\u0633\u06cc"}, {"variants": ["hichi", "hichy", "hchi", "hichii"], "meaning": "\u0647\u06cc\u0686\u06cc"}, {"variants": ["hame", "hameh", "hme", "hamme"], "meaning": "\u0647\u0645\u0647"}, {"variants": ["harchi", "harchii", "hrchi", "harci"], "meaning": "\u0647\u0631\u0686\u06cc"}, {"variants": ["mage", "mageh", "mge", "magge"], "meaning": "\u0645\u06af\u0647"}, {"variants": ["pas", "pss", "paas", "pass"], "meaning": "\u067e\u0633"}, {"variants": ["chon", "choon", "chun", "choun"], "meaning": "\u0686\u0648\u0646"}, {"variants": ["ta", "taa", "ttta", "taaa"], "meaning": "\u062a\u0627"}, {"variants": ["ke", "keh", "kkeh", "keeh"], "meaning": "\u06a9\u0647"}, {"variants": ["ba", "baa", "baaa", "bba"], "meaning": "\u0628\u0627"}, {"variants": ["be", "beh", "beeh", "bbe"], "meaning": "\u0628\u0647"}, {"variants": ["az", "azz", "aaz", "azze"], "meaning": "\u0627\u0632"}, {"variants": ["dar", "darr", "daar", "drar"], "meaning": "\u062f\u0631"}, {"variants": ["oon", "un", "uun", "oun"], "meaning": "\u0627\u0648\u0646"}, {"variants": ["in", "een", "iin", "iiun"], "meaning": "\u0627\u06cc\u0646"}, {"variants": ["ye", "yek", "yeh", "yak"], "meaning": "\u06cc\u0647"}, {"variants": ["do", "dow", "doo", "dou"], "meaning": "\u062f\u0648"}, {"variants": ["se", "seh", "see", "seeh"], "meaning": "\u0633\u0647"}, {"variants": ["chahar", "chaar", "char", "chahaar"], "meaning": "\u0686\u0647\u0627\u0631"}, {"variants": ["panj", "pnj", "panjj", "paanj"], "meaning": "\u067e\u0646\u062c"}, {"variants": ["shish", "shsh", "sheesh", "shesh"], "meaning": "\u0634\u0634"}, {"variants": ["haft", "hft", "hafft", "haaft"], "meaning": "\u0647\u0641\u062a"}, {"variants": ["hasht", "hsht", "hashht", "haasht"], "meaning": "\u0647\u0634\u062a"}, {"variants": ["noh", "nuh", "nooh", "no"], "meaning": "\u0646\u0647"}, {"variants": ["dah", "dahh", "daah", "da"], "meaning": "\u062f\u0647"}, {"variants": ["sad", "saad", "sadd", "sd"], "meaning": "\u0635\u062f"}, {"variants": ["hezar", "hezaar", "hzar", "hezr"], "meaning": "\u0647\u0632\u0627\u0631"}, {"variants": ["milion", "milioon", "milyon", "meelion"], "meaning": "\u0645\u06cc\u0644\u06cc\u0648\u0646"}, {"variants": ["saat", "saaet", "sat", "saaaat"], "meaning": "\u0633\u0627\u0639\u062a"}, {"variants": ["daghighe", "daqiqe", "daghiqe", "dghighe"], "meaning": "\u062f\u0642\u06cc\u0642\u0647"}, {"variants": ["sanie", "saniye", "sanyeh", "saniyeh"], "meaning": "\u062b\u0627\u0646\u06cc\u0647"}, {"variants": ["hafte", "hafteh", "haafteh", "hfte"], "meaning": "\u0647\u0641\u062a\u0647"}, {"variants": ["maah", "mah", "mahh", "maaah"], "meaning": "\u0645\u0627\u0647"}, {"variants": ["saal", "sal", "saall", "saaal"], "meaning": "\u0633\u0627\u0644"}, {"variants": ["shanbe", "shanbeh", "shambe", "shanbee"], "meaning": "\u0634\u0646\u0628\u0647"}, {"variants": ["jome", "jomee", "jomeh", "jomme"], "meaning": "\u062c\u0645\u0639\u0647"}, {"variants": ["sobhane", "sobhaane", "sbhane", "sobhne"], "meaning": "\u0635\u0628\u062d\u0627\u0646\u0647"}, {"variants": ["nahar", "nahaar", "nahr", "nahhar"], "meaning": "\u0646\u0627\u0647\u0627\u0631"}, {"variants": ["sham", "shaam", "shamm", "shm"], "meaning": "\u0634\u0627\u0645"}, {"variants": ["nan", "naan", "noon", "nuun"], "meaning": "\u0646\u0627\u0646"}, {"variants": ["goosht", "gusht", "gosht", "gousht"], "meaning": "\u06af\u0648\u0634\u062a"}, {"variants": ["morgh", "murgh", "mrgh", "morq"], "meaning": "\u0645\u0631\u063a"}, {"variants": ["mahi", "mahii", "mahee", "mahy"], "meaning": "\u0645\u0627\u0647\u06cc"}, {"variants": ["berenj", "branj", "berenj", "berenjj"], "meaning": "\u0628\u0631\u0646\u062c"}, {"variants": ["sabzi", "sabzy", "sabzii", "sbzi"], "meaning": "\u0633\u0628\u0632\u06cc"}, {"variants": ["mive", "miveh", "meeveh", "mivee"], "meaning": "\u0645\u06cc\u0648\u0647"}, {"variants": ["shir", "sheer", "shir", "shiir"], "meaning": "\u0634\u06cc\u0631"}, {"variants": ["panir", "paneer", "pnir", "paniir"], "meaning": "\u067e\u0646\u06cc\u0631"}, {"variants": ["tokhmmorgh", "tokhmemorgh", "tokhm", "tokhmorgh"], "meaning": "\u062a\u062e\u0645\u200c\u0645\u0631\u063a"}, {"variants": ["namak", "nmaak", "nmak", "namakk"], "meaning": "\u0646\u0645\u06a9"}, {"variants": ["felfel", "flfl", "felfl", "felfell"], "meaning": "\u0641\u0644\u0641\u0644"}, {"variants": ["roghan", "rowqan", "roqan", "roghaan"], "meaning": "\u0631\u0648\u063a\u0646"}, {"variants": ["ghand", "qand", "ghnd", "qhand"], "meaning": "\u0642\u0646\u062f"}, {"variants": ["shekar", "shekr", "shekaar", "shkar"], "meaning": "\u0634\u06a9\u0631"}, {"variants": ["asal", "asl", "asaal", "asall"], "meaning": "\u0639\u0633\u0644"}], "FINGLISH_TEMPLATES": ["{0}! {1} {2}? {3} {4}.", "{0}, {1}. {2} {3} {4}?", "{0} {1}, {2} {3}. {4}!", "{0}! {1} {2} {3} {4}."]};



    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const hasWebCrypto = typeof crypto !== 'undefined' && !!crypto.subtle && window.isSecureContext;
    let installedVersion = localStorage.getItem('mixer_installed_version') || '';
    let installedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid') || '';
    let latestVersionInfo = null;
    let updateAvailable = false;
    const VERSION_CACHE_KEY = 'mixer_latest_version_info';
    const ALERT_CACHE_KEY = 'mixer_latest_alert_info';
    const ALERT_DISMISS_KEY = 'mixer_alert_dismissed_aid';
    let alertInfo = null;
    let dismissedAlertAid = localStorage.getItem(ALERT_DISMISS_KEY) || '';
    let alertCheckInFlight = null;
    let lastAlertCheck = 0;
    const ALERT_CHECK_INTERVAL = 30000;
    let updateCheckInFlight = null;
    let lastUpdateCheck = 0;
    const UPDATE_CHECK_INTERVAL = 30000;

    const faToIndexMap = {};
    faAlphabet.forEach((ch, idx) => {
        faToIndexMap[ch] = idx;
    });

    let currentLang = localStorage.getItem('mixer_lang') || 'fa';
    let currentTheme = localStorage.getItem('mixer_theme') || 'dark';
    let currentPattern = localStorage.getItem('mixer_pattern') || 'default';
    let pinRecord = loadStoredPin();
    let lockSatisfied = !pinRecord;
    let lastEnteredPin = '';
    let currentPassword = pinRecord ? '' : (localStorage.getItem('mixer_password') || '');
    let chunkingEnabled = (localStorage.getItem('mixer_chunking') || 'off') !== 'off';
    let lastPasswordState = !!currentPassword;
    let panicHoldTimer = null;
    let panicHoldInterval = null;
    let panicRemaining = 0;
    let refreshHoldTimer = null;
    let refreshHoldInterval = null;
    let refreshRemaining = 0;
    let refreshInProgress = false;
    let connectionWatchTimer = null;
    const STATUS_ONLINE = 'online';
    const STATUS_OFFLINE = 'offline';
    const STATUS_NATIONAL = 'national';
    const PRIMARY_CHECK_URL = 'https://github.com/';
    const NATIONAL_CHECK_URL = 'https://www.aparat.com/';
    let lastKnownStatus = navigator.onLine !== false ? STATUS_ONLINE : STATUS_OFFLINE;
    let statusCheckInFlight = null;
    let lastStatusCheck = 0;
    const STATUS_CHECK_INTERVAL = 8000;
    let unlockInProgress = false;
    let failedPinAttempts = 0;
    let currentChunks = [];
    let lastChunkView = 'single';
    let lastEncodedOutput = '';
    const zwcDisplayRegex = /[\u200B\u200C\u200D\u2060\u2061\uFEFF]/g;

    function stripZwcForDisplay(text) {
        return text ? text.replace(zwcDisplayRegex, '') : '';
    }

    function getTranslations(lang) {
        return lang === 'fa' ? window.langFa : window.langEn;
    }

    function t(key, vars) {
        const primary = getTranslations(currentLang) || {};
        const fallback = window.langEn || {};
        let text = primary[key] || fallback[key] || '';
        if (vars) {
            Object.keys(vars).forEach((k) => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
            });
        }
        return text;
    }

    function formatTemplate(text, vars) {
        let out = text || '';
        if (vars) {
            Object.keys(vars).forEach((k) => {
                out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
            });
        }
        return out;
    }

    function getLocalizedValue(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[currentLang] || value.fa || value.en || '';
    }

    function compareVersions(a, b) {
        const left = String(a || '').split('.').map((part) => parseInt(part, 10));
        const right = String(b || '').split('.').map((part) => parseInt(part, 10));
        const len = Math.max(left.length, right.length);
        for (let i = 0; i < len; i++) {
            const l = Number.isFinite(left[i]) ? left[i] : 0;
            const r = Number.isFinite(right[i]) ? right[i] : 0;
            if (l > r) return 1;
            if (l < r) return -1;
        }
        return 0;
    }

    function toEnglishDigits(input) {
        return input
            .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
            .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
    }

    function toPersianDigits(input) {
        return input.replace(/\d/g, (d) => String.fromCharCode(0x06F0 + (d.charCodeAt(0) - 48)));
    }

    function formatCountdownSeconds(seconds) {
        const value = String(seconds);
        return currentLang === 'fa' ? toPersianDigits(value) : value;
    }

    function weakHashPin(pin, saltBytes) {
        let hash = 2166136261 >>> 0;
        for (let i = 0; i < pin.length; i++) {
            hash ^= pin.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        for (let i = 0; i < saltBytes.length; i++) {
            hash ^= saltBytes[i];
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function updateVersionDisplay() {
        const el = document.getElementById('version-value');
        if (!el) return;
        const value = installedVersion || latestVersionInfo?.version || '';
        if (!value) {
            el.textContent = '--';
            return;
        }
        el.textContent = currentLang === 'fa' ? toPersianDigits(value) : value;
    }

    function readCachedJson(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return data && typeof data === 'object' ? data : null;
        } catch (e) {
            return null;
        }
    }

    function cacheVersionInfo(info) {
        try {
            if (info) {
                localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(info));
            } else {
                localStorage.removeItem(VERSION_CACHE_KEY);
            }
        } catch (e) {}
    }

    function cacheAlertInfo(info) {
        try {
            if (info) {
                localStorage.setItem(ALERT_CACHE_KEY, JSON.stringify(info));
            } else {
                localStorage.removeItem(ALERT_CACHE_KEY);
            }
        } catch (e) {}
    }

    function loadCachedVersionInfo() {
        const info = readCachedJson(VERSION_CACHE_KEY);
        if (!info || !info.version) return;
        latestVersionInfo = info;
        const storedVersion = localStorage.getItem('mixer_installed_version') || '';
        const storedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid');
        installedVersion = storedVersion;
        installedVid = storedVid || '';
        if (!storedVersion) return;
        const versionChanged = compareVersions(info.version, installedVersion) > 0;
        const vidChanged = !!(info.vid && installedVid && info.vid !== installedVid);
        updateAvailable = versionChanged || vidChanged;
    }

    function loadCachedAlertInfo() {
        const info = readCachedJson(ALERT_CACHE_KEY);
        if (!info) return;
        alertInfo = info;
    }

    function bytesToBase64Url(bytes) {
        let binary = '';
        bytes.forEach((b) => {
            binary += String.fromCharCode(b);
        });
        let b64 = btoa(binary);
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        return b64;
    }

    function base64UrlToBytes(str) {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    }

    function utf8ToBase64Url(str) {
        return bytesToBase64Url(enc.encode(str));
    }

    function base64UrlToUtf8(str) {
        return dec.decode(base64UrlToBytes(str));
    }

    const identityPerm = Array.from({ length: baseAlphabet.length }, (_, i) => i);

    function makePermutation(seed) {
        const arr = Array.from({ length: baseAlphabet.length }, (_, i) => i);
        let state = seed >>> 0;
        for (let i = arr.length - 1; i > 0; i--) {
            state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
            const j = state % (i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function permutationFromPassword(pwd) {
        if (!pwd) return identityPerm;
        let hash = 2166136261 >>> 0; // FNV-1a 32bit
        for (let i = 0; i < pwd.length; i++) {
            hash ^= pwd.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        const seed = hash >>> 0 || 1;
        return makePermutation(seed);
    }

    function inversePermutation(perm) {
        const inv = new Array(perm.length);
        for (let i = 0; i < perm.length; i++) {
            inv[perm[i]] = i;
        }
        return inv;
    }

    function toPersianAlphabet(str, perm = identityPerm) {
        let out = '';
        for (const ch of str) {
            const idx = baseAlphabet.indexOf(ch);
            if (idx === -1) throw new Error('INVALID_ALPHABET');
            out += faAlphabet[perm[idx]];
        }
        return out;
    }

    function fromPersianAlphabet(str, invPerm = identityPerm) {
        const compact = str.replace(/\s+/g, '');
        let out = '';
        for (const ch of compact) {
            const idx = faToIndexMap[ch];
            if (idx === undefined) throw new Error('INVALID_ALPHABET');
            const baseIdx = invPerm[idx];
            out += baseAlphabet[baseIdx];
        }
        return out;
    }

    function randomBytes(len) {
        const arr = new Uint8Array(len);
        if (crypto?.getRandomValues) {
            crypto.getRandomValues(arr);
        } else {
            for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
    }

    function randomBaseChars(len) {
        let result = '';
        for (let i = 0; i < len; i++) {
            const idx = Math.floor(Math.random() * baseAlphabet.length);
            result += baseAlphabet[idx];
        }
        return result;
    }

    async function deriveKey(password, salt) {
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            enc.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: 120000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptWithPassword(text, password) {
        const salt = randomBytes(12);
        const iv = randomBytes(12);
        const key = await deriveKey(password, salt);
        const cipherBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            enc.encode(text)
        );
        const cipher = new Uint8Array(cipherBuffer);
        const payload = new Uint8Array(1 + salt.length + iv.length + cipher.length);
        let offset = 0;
        payload[offset++] = 1;
        payload.set(salt, offset);
        offset += salt.length;
        payload.set(iv, offset);
        offset += iv.length;
        payload.set(cipher, offset);
        const b64 = bytesToBase64Url(payload);
        const perm = permutationFromPassword(password);
        return toPersianAlphabet(b64, perm);
    }

    async function decryptWithPassword(text, password) {
        const perm = permutationFromPassword(password);
        const inv = inversePermutation(perm);
        const b64 = fromPersianAlphabet(text, inv);
        const bytes = base64UrlToBytes(b64);
        if (bytes[0] !== 1) throw new Error('BAD_VERSION');
        let offset = 1;
        const salt = bytes.slice(offset, offset + 12);
        offset += 12;
        const iv = bytes.slice(offset, offset + 12);
        offset += 12;
        const cipher = bytes.slice(offset);
        const key = await deriveKey(password, salt);
        const plainBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            cipher
        );
        return dec.decode(plainBuffer);
    }

    function encodeWithoutPassword(text) {
        const body = utf8ToBase64Url(text);
        const prefixLen = 3 + Math.floor(Math.random() * 3);
        const suffixLen = 3 + Math.floor(Math.random() * 3);
        const prefix = randomBaseChars(prefixLen);
        const suffix = randomBaseChars(suffixLen);

        const totalLen = 3 + prefixLen + body.length + suffixLen;
        const bytes = new Uint8Array(totalLen);

        let offset = 0;
        bytes[offset++] = 0;
        bytes[offset++] = prefixLen;
        bytes[offset++] = suffixLen;
        for (const ch of prefix) bytes[offset++] = ch.charCodeAt(0);
        for (const ch of body) bytes[offset++] = ch.charCodeAt(0);
        for (const ch of suffix) bytes[offset++] = ch.charCodeAt(0);

        const b64 = bytesToBase64Url(bytes);
        return toPersianAlphabet(b64, identityPerm);
    }

    function decodeWithoutPassword(text) {
        const b64 = fromPersianAlphabet(text, identityPerm);
        const bytes = base64UrlToBytes(b64);
        if (bytes[0] === 1) throw new Error('PASSWORD_REQUIRED');
        if (bytes[0] !== 0) throw new Error('BAD_VERSION');
        const prefixLen = bytes[1];
        const suffixLen = bytes[2];
        if (prefixLen < 3 || prefixLen > 5 || suffixLen < 3 || suffixLen > 5) {
            throw new Error('BAD_LAYOUT');
        }
        const start = 3 + prefixLen;
        const end = bytes.length - suffixLen;
        if (start < 3 || end < start) throw new Error('BAD_LAYOUT');
        for (let i = 3; i < start; i++) {
            const ch = String.fromCharCode(bytes[i]);
            if (!baseAlphabetCharSet.has(ch)) throw new Error('BAD_PREFIX');
        }
        for (let i = end; i < bytes.length; i++) {
            const ch = String.fromCharCode(bytes[i]);
            if (!baseAlphabetCharSet.has(ch)) throw new Error('BAD_SUFFIX');
        }
        let body = '';
        for (let i = start; i < end; i++) {
            const ch = String.fromCharCode(bytes[i]);
            if (!baseAlphabetCharSet.has(ch)) throw new Error('BAD_BODY');
            body += ch;
        }
        return base64UrlToUtf8(body);
    }

    const PATTERN_DEFAULT = 'default';
    const patternRegistry = createPatternRegistry();

    function resolvePatternId(id) {
        return patternRegistry?.patterns?.[id] ? id : PATTERN_DEFAULT;
    }

    function createPatternRegistry() {
        const data = OLGO_DATA || {};
        const patterns = {};
        const baseAlphabetSet = new Set(faAlphabet);
        const persianMap = data.PERSIAN_MAP || {};
        const persianReverse = buildReverseMap(persianMap);
        const capitalMarker = '\u0640';
        const defaultCarrier = '\u0627\u06cc\u0646 \u06cc\u06a9 \u067e\u06cc\u0627\u0645 \u0645\u0639\u0645\u0648\u0644\u06cc \u0627\u0633\u062a.';
        const zwcCarriers = [
            '\u0633\u0644\u0627\u0645\u0020\u0686\u062e\u0628\u0631',
            '\u0686\u06cc\u06a9\u0627\u0631\u0627\u0020\u0645\u06cc\u06a9\u0646\u06cc',
            '\u0627\u0635\u0644\u0020\u0645\u06cc\u062f\u06cc',
            '\u0686\u0631\u0627\u0020\u067e\u06cc\u0627\u0645\u062a\u0020\u0645\u06cc\u062f\u0645\u0020\u062c\u0648\u0627\u0628\u0020\u0646\u0645\u06cc\u062f\u06cc',
            '\u0646\u062a\u0645\u0020\u0627\u0635\u0646\u0020\u062e\u0648\u0628\u0020\u0646\u06cc\u0633\u062a\u0020\u0627\u0645\u0634\u0628',
            '\u0628\u0631\u06cc\u0645\u0020\u0628\u062e\u0648\u0627\u0628\u06cc\u0645',
            '\u0628\u06cc\u0020\u0627\u062f\u0628',
            '\u062e\u06cc\u0644\u06cc\u0020\u062e\u0648\u0628\u0647',
            '\u0627\u0631\u0647\u0020\u062e\u0648\u0628\u0645',
            '\u0647\u0645\u0647\u0020\u0686\u06cc\u0020\u062f\u0631\u0633\u062a\u0020\u0645\u06cc\u0634\u0647',
            '\u0648\u0642\u062a\u062a\u0020\u0628\u062e\u06cc\u0631',
            '\u0648\u0642\u062a\u0020\u0628\u062e\u06cc\u0631',
            '\u062c\u0648\u0627\u0628\u0020\u0645\u06cc\u062f\u06cc',
            '\u0686\u0631\u0627\u0020\u062c\u0648\u0627\u0628\u0020\u0646\u0645\u06cc\u062f\u06cc',
            '\u0647\u0639\u06cc\u0020\u062d\u06cc\u062f\u0631\u0020\u0628\u0627\u0628\u0627\u0020\u06cc\u0627\u0644\u0627\u0646\u0020\u062f\u0648\u0646\u06cc\u0627\u0020\u06cc\u0627\u0644\u0627\u0646\u0020\u062f\u0648\u0646\u06cc\u0627',
            '\u062d\u0627\u062c\u06cc\u0020\u0645\u0646\u0020\u067e\u06cc\u0631\u0645',
            '\u062d\u0627\u062c\u06cc\u0020\u0646\u0627\u0645\u0648\u0633\u0646',
            '\u0648\u0627\u0642\u0639\u0627\u0020\u0646\u0645\u06cc\u0635\u0631\u0641\u0647',
            '\u0686\u0646\u062f\u0020\u0633\u0627\u0644\u062a\u0647',
            '\u0627\u0645\u0631\u0648\u0632\u0020\u062d\u0627\u0644\u062a\u0020\u062e\u0648\u0628\u0647',
            '\u0627\u0645\u0631\u0648\u0632\u0020\u062d\u0627\u0644\u062a\u0020\u0628\u062f\u0647',
            '\u0645\u0646\u0020\u0645\u06cc\u062f\u0648\u0646\u0645\u0020\u06a9\u0647\u0020\u062e\u0648\u0628\u0020\u0646\u06cc\u0633\u062a\u06cc',
            '\u0645\u0646\u0020\u0645\u06cc\u062f\u0648\u0646\u0645\u0020\u06a9\u0647\u0020\u062e\u0648\u0628\u06cc',
            '\u062f\u0631\u0020\u0647\u06cc\u0686\u0020\u0642\u0635\u0647\u0020\u0648\u0020\u0627\u0641\u0633\u0627\u0646\u0647\u0020\u0627\u06cc\u0020\u0634\u0628\u06cc\u0020\u0646\u0628\u0648\u062f\u0020\u06a9\u0647\u0020\u0627\u0646\u062a\u0647\u0627\u0634\u0020\u0631\u0648\u0632\u0020\u0646\u0634\u062f',
            '\u0686\u062e\u0628\u0631\u0020\u062e\u0648\u0634\u062a\u06cc\u067e',
            '\u0633\u0644\u0627\u0645\u0020\u062e\u0648\u0634\u062a\u06cc\u067e',
            '\u0631\u0627\u0628\u0631\u062a\u0020\u0627\u06cc\u0646\u0020\u062f\u0627\u0634\u0627\u0642\u0647\u0020\u062f\u0627\u0634\u0627\u0642',
            '\u0633\u0631\u0645\u0020\u062f\u0631\u062f\u0020\u0645\u06cc\u06a9\u0646\u0647',
            '\u0642\u0644\u0628\u0645\u0020\u062f\u0631\u062f\u0020\u0645\u06cc\u06a9\u0646\u0647',
            '\u0645\u06cc\u062e\u0648\u0627\u0645\u0020\u0628\u0631\u0645\u0020\u062f\u06a9\u062a\u0631',
            '\u0645\u0627\u0634\u06cc\u0646\u0645\u0020\u062e\u0631\u0627\u0628\u0020\u0634\u062f\u0647',
            '\u0645\u06cc\u062e\u0648\u0627\u0645\u0020\u0628\u0631\u0645\u0020\u0645\u06a9\u0627\u0646\u06cc\u06a9',
            '\u0645\u06cc\u062e\u0648\u0627\u0645\u0020\u0628\u0631\u0645\u0020\u0633\u0631\u06a9\u0627\u0631',
            '\u0645\u0646\u0020\u062f\u06cc\u06af\u0020\u0628\u0631\u0645\u0020\u0641\u0644\u0646',
            '\u06a9\u0627\u0631\u06cc\u0020\u0646\u062f\u0627\u0631\u06cc',
            '\u06a9\u0627\u0631\u06cc\u0020\u0628\u0627\u0631\u06cc',
            '\u062a\u0648\u0634\u0020\u0645\u0648\u0632\u0647\u0020\u0645\u0648\u0632',
            '\u0645\u0645\u0646\u0648\u0646\u0020\u062e\u0648\u0634\u062a\u06cc\u067e',
            '\u0645\u0645\u0646\u0648\u0646\u0020\u0634\u0645\u0627\u0020\u0647\u0633\u062a\u0645',
            '\u0648\u0627\u06a9\u0646\u0634\u0020\u0645\u0646',
            '\u0645\u06af\u0020\u0646',
        ];

        const zwcBinaryChars = ['\u200C', '\u200D'];
        const zwcModernChars = ['\u200B', '\u2060', '\u2061', '\uFEFF'];
        const zwcLegacyChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
        const zwcDetectChars = [...new Set([...zwcBinaryChars, ...zwcModernChars, ...zwcLegacyChars])];

        const smsWords = Array.isArray(data.SMS_WORDS_64) ? data.SMS_WORDS_64 : [];
        const smsWordToIndex = new Map(smsWords.map((word, idx) => [word, idx]));
        const byteWords = Array.isArray(data.BYTE_WORDS) ? data.BYTE_WORDS : [];
        const byteWordToIndex = new Map(byteWords.map((word, idx) => [word, idx]));
        const homoglyphPairs = Array.isArray(data.HOMOGLYPH_PAIRS) ? data.HOMOGLYPH_PAIRS : [];
        const emojiGroups = Array.isArray(data.EMOJI_ENCODE_GROUPS) ? data.EMOJI_ENCODE_GROUPS : [];
        const finglishWords = Array.isArray(data.FINGLISH_WORDS) ? data.FINGLISH_WORDS : [];
        const finglishTemplates = Array.isArray(data.FINGLISH_TEMPLATES) ? data.FINGLISH_TEMPLATES : [];

        const smsMiniTemplates = [
            `کاربر گرامی والکس؛ کد تایید شما: {code}
@wallex.ir #{tag}`,
            `Code: {code}
کد تایید جاجیگا

@www.jajiga.com #{tag}`,
            `کد تایید تلفن همراه شما در ملی گلد:
Code: {code}

@meligold.ir #{tag}`,
            `کد تایید: {code}

باجت: بانک تجارت

@mybajet.ir #{tag}`,
            `کد تایید دیوار:
Code: {code}
برای دیگران نفرستید.

@divar.ir #{tag}`,
            `با سلام ✋🏼 کد تایید شما در بسپارتو: {code}

@besparto.ir #{tag}`,
            `بانکت
بازیابی نام کاربری
لطفا کد تایید را وارد کنید:
Code: {code}
#{tag}`,
            `گنجه
کد تایید: {code}
@app.ganje.net #{tag}`,
            `code: {code}
کد تایید دیجی‌پی

@mydigipay.com #{tag}`,
            `دیجی‌کالا
کد تایید: {code}

#{tag}`,
            `به صرافی ارز دیجیتال تبدیل خوش آمدید!
کد تایید ثبت‌نام در تبدیل
Code: {code}

@tabdeal.org #{tag}
لغو11`,
            `کد تایید شما در نامبرلند: {code}

@numberland.ir #{tag}

لغو11`,
            `تکنولایف
کد تایید استفاده از کیف پول اوانو: {code}

@technolife.com #{tag}`,
            `کد تایید : {code}  سامانه رسیدگی به شکایات شرکت ملی پست

@post.ir #{tag}`,
            `کد تایید مایکت: {code}

#{tag}`,
            `بلو
لطفا کد زیر را هرگز در اختیار هیچ‌کس قرار ندهید. این کد برای شما و فقط برای وارد کردن در اپلیکیشن بلو توسط خود شما و در گوشی تلفن همراه شما، ارسال شده است.

CODE: {code}

در صورت قرار دادن این کد در اختیار دیگران، اجازه‌ی ورود به حساب بانکی خود را به آن‌ها می‌دهید.

@blubank.sb24.ir #{tag}`,
            `code: {code}
کد فعال‌سازی باسلام

@basalam.com #{tag}`,
            `Code: {code}
کد ورود اسنپ
برای دیگران نفرستید

@app.snapp.taxi #{tag}`,
            `کد یکبار مصرف تغییر رمز عبور میلی:
{code}
@milli.gold #{tag}`
        ];
        const smsMiniAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const smsMiniSaltLength = 2;
        const smsMiniHashLength = 4;
        const smsMiniCodeMarker = '{code}';
        const smsMiniTagMarker = '#{tag}';

        const homoglyphBaseIndex = new Map();
        const homoglyphAltIndex = new Map();
        homoglyphPairs.forEach((pair, idx) => {
            if (!pair || pair.length !== 2) return;
            homoglyphBaseIndex.set(pair[0], idx);
            homoglyphAltIndex.set(pair[1], idx);
        });

        const emojiAlphabet = [];
        const emojiSeen = new Set();
        const emojiPool = [];
        emojiGroups.forEach((group) => {
            (group || []).forEach((emoji) => emojiPool.push(emoji));
        });
        const legacyEmojiPool = Array.isArray(data.LEGACY_EMOJI_POOL) ? data.LEGACY_EMOJI_POOL : [];
        legacyEmojiPool.forEach((emoji) => emojiPool.push(emoji));
        emojiPool.forEach((emoji) => {
            if (!emoji || emojiSeen.has(emoji)) return;
            if (!isSafeEmoji(emoji)) return;
            emojiSeen.add(emoji);
            emojiAlphabet.push(emoji);
        });
        const emojiSymbolBits = emojiAlphabet.length >= 256 ? 8 : (emojiAlphabet.length >= 128 ? 7 : (emojiAlphabet.length >= 64 ? 6 : (emojiAlphabet.length >= 32 ? 5 : (emojiAlphabet.length >= 16 ? 4 : 2))));
        const emojiSymbolCount = 1 << emojiSymbolBits;
        const emojiSymbols = emojiAlphabet.slice(0, emojiSymbolCount);
        const emojiIndexMap = new Map();
        emojiSymbols.forEach((emoji, idx) => {
            emojiIndexMap.set(emoji, idx);
        });
        const emojiMinCount = Math.max(5, Math.ceil(40 / emojiSymbolBits));

        const namNamTokensV4 = [
            { token: 'ناا', bits: '0000' },
            { token: 'نااا', bits: '0001' },
            { token: 'ناااا', bits: '0010' },
            { token: 'نااااا', bits: '0011' },
            { token: 'ناااااا', bits: '0100' },
            { token: 'نااااااا', bits: '0101' },
            { token: 'ناااااااا', bits: '0110' },
            { token: 'نااااااااا', bits: '0111' },
            { token: 'نام', bits: '1000' },
            { token: 'نامم', bits: '1001' },
            { token: 'ناممم', bits: '1010' },
            { token: 'نامممم', bits: '1011' },
            { token: 'ناممممم', bits: '1100' },
            { token: 'نامممممم', bits: '1101' },
            { token: 'ناممممممم', bits: '1110' },
            { token: 'نامممممممم', bits: '1111' }
        ];
        const namNamTokensV4ByLength = [...namNamTokensV4].sort((a, b) => b.token.length - a.token.length);
        const namNamTokensV2 = [
            { token: 'نااا', bits: '00' },
            { token: 'ناااا', bits: '01' },
            { token: 'نام', bits: '10' },
            { token: 'ناممم', bits: '11' }
        ];
        const namNamTokensV2ByLength = [...namNamTokensV2].sort((a, b) => b.token.length - a.token.length);
        const namNamTokensV2Set = new Set(namNamTokensV2.map((entry) => entry.token));
        const namNamTokensV4ExtraSet = new Set(namNamTokensV4.map((entry) => entry.token).filter((token) => !namNamTokensV2Set.has(token)));
        const legacyNamNamTokens = [
            { token: 'نام', bits: '1' },
            { token: 'نا', bits: '0' }
        ];
        const legacyNamNamTokensByLength = [...legacyNamNamTokens].sort((a, b) => b.token.length - a.token.length);

        const legacyTokens = buildLegacyTokens(data);
        const legacyTokenToIndex = new Map(legacyTokens.map((token, idx) => [token, idx]));

        const detectOrder = [
            'zwc',
            'sms-mini',
            'sms-stealth',
            'emoji',
            'sentence',
            PATTERN_DEFAULT
        ];

        patterns[PATTERN_DEFAULT] = {
            id: PATTERN_DEFAULT,
            encode: encodeDefault,
            decode: decodeDefault,
            detect: detectDefault
        };
        patterns.sentence = {
            id: 'sentence',
            encode: encodeSentenceMode,
            decode: decodeSentenceMode,
            detect: detectSentence
        };
        patterns['sms-mini'] = {
            id: 'sms-mini',
            encode: encodeSmsMiniMode,
            decode: decodeSmsMiniMode,
            detect: detectSmsMini
        };
        patterns.zwc = {
            id: 'zwc',
            encode: encodeZwcMode,
            decode: decodeZwcMode,
            detect: detectZwc
        };
        patterns['sms-stealth'] = {
            id: 'sms-stealth',
            encode: encodeStealthMode,
            decode: decodeStealthMode,
            detect: detectStealth
        };
        patterns.emoji = {
            id: 'emoji',
            encode: encodeEmojiMode,
            decode: decodeEmojiMode,
            detect: detectEmoji
        };
        function isPasswordError(err) {
            const code = err?.message || err;
            return code === 'PASSWORD_REQUIRED' || code === 'PASSWORD_UNAVAILABLE';
        }

        function isFatalDecodeError(err, id, detected) {
            if (!detected.has(id)) return false;
            const code = err?.message || err;
            if (id === 'sms-mini') {
                return typeof code === 'string' && code.startsWith('SMS_MINI_');
            }
            return false;
        }

        async function encodeText(text, password, patternId) {
            const id = patterns[patternId] ? patternId : PATTERN_DEFAULT;
            return patterns[id].encode(text, password);
        }

        async function decodeText(text, password) {
            const { ordered, detected } = pickCandidates(text);
            let lastError = null;
            let passwordError = null;
            const hasPassword = !!(password && password.trim());
            for (const id of ordered) {
                const pattern = patterns[id];
                if (!pattern) continue;
                try {
                    const decoded = await pattern.decode(text, password);
                    if (!hasPassword && passwordError) continue;
                    return decoded;
                } catch (err) {
                    lastError = err;
                    if (isFatalDecodeError(err, id, detected)) throw err;
                    if (!hasPassword && isPasswordError(err) && detected.has(id)) {
                        passwordError = err;
                        break;
                    }
                }
            }
            if (passwordError) throw passwordError;
            if (lastError) throw lastError;
            throw new Error('DECODE_FAILED');
        }

        function pickCandidates(text) {
            const hits = [];
            detectOrder.forEach((id) => {
                const pattern = patterns[id];
                if (pattern && pattern.detect(text)) hits.push(id);
            });
            const detected = new Set(hits);
            const ordered = Array.from(detected);
            return { ordered, detected };
        }

        function encodeDefault(text, password) {
            if (password) return encryptWithPassword(text, password);
            return Promise.resolve(encodeWithoutPassword(text));
        }

        async function decodeDefault(text, password) {
            if (password) return decryptWithPassword(text, password);
            return decodeWithoutPassword(text);
        }

        function detectDefault(text) {
            const compact = (text || '').replace(/\s+/g, '');
            if (compact.length < 12) return false;
            for (const ch of compact) {
                if (!baseAlphabetSet.has(ch)) return false;
            }
            const spaceRatio = text.length ? (text.length - compact.length) / text.length : 0;
            return spaceRatio < 0.25;
        }

        async function encodePersian(text, password) {
            if (!text) return '';
            if (password) {
                const packed = await packV2(text, password);
                const b64 = bytesToBase64(packed);
                return encodePersianMap(b64);
            }
            return encodePersianMap(text);
        }

        async function decodePersian(text, password) {
            const decoded = decodePersianMap(text);
            if (!password) {
                if (looksLikeBase64(decoded)) throw new Error('PASSWORD_REQUIRED');
                return decoded;
            }
            if (!looksLikeBase64(decoded)) throw new Error('PERSIAN_BAD_PAYLOAD');
            const bytes = base64ToBytes(decoded);
            return await unpackV2(bytes, password);
        }

        function detectPersian(text) {
            const compact = (text || '').replace(/\s+/g, '');
            if (compact.length < 8) return false;
            let matched = 0;
            let hasMarker = false;
            for (const ch of compact) {
                if (ch === capitalMarker) {
                    matched += 1;
                    hasMarker = true;
                    continue;
                }
                if (persianReverse[ch] !== undefined) {
                    matched += 1;
                    if (!baseAlphabetSet.has(ch)) hasMarker = true;
                }
            }
            return hasMarker && matched / compact.length > 0.7;
        }

        async function encodeSentenceMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeSentence(bytes);
        }

        async function decodeSentenceMode(text, password) {
            const bytes = decodeSentence(text);
            return unpackV2(bytes, password);
        }

        function detectSentence(text) {
            const words = splitWords(text);
            if (words.length < 3) return false;
            let matched = 0;
            words.forEach((word) => {
                if (byteWordToIndex.has(word)) matched += 1;
            });
            return matched / words.length > 0.3;
        }        function pickZwcCarrier() {
            if (Array.isArray(zwcCarriers) && zwcCarriers.length) {
                const idx = Math.floor(Math.random() * zwcCarriers.length);
                return zwcCarriers[idx];
            }
            return defaultCarrier;
        }


        async function encodeZwcMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeZwc(bytes, pickZwcCarrier());
        }

        async function decodeZwcMode(text, password) {
            const decoders = [
                () => decodeZwcBinary(text),
                () => decodeZwcBase4Any(text)
            ];
            let lastError = null;
            for (const decode of decoders) {
                try {
                    const bytes = decode();
                    return await unpackV2(bytes, password);
                } catch (err) {
                    lastError = err;
                    if (isPasswordError(err)) throw err;
                }
            }
            throw lastError || new Error('ZWC_BAD_TOKEN');
        }

        function detectZwc(text) {
            let zwcCount = 0;
            for (const ch of text) {
                if (zwcDetectChars.includes(ch)) zwcCount += 1;
            }
            const compact = text.replace(/\s+/g, '');
            return zwcCount >= 8 && (compact.length === 0 || zwcCount / compact.length > 0.05);
        }

        async function encodeSmsCompactMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeSmsCompact(bytes);
        }

        async function decodeSmsCompactMode(text, password) {
            const bytes = decodeSmsCompact(text);
            return unpackV2(bytes, password);
        }

        function detectSmsCompact(text) {
            const words = text.split(/\s+/).filter(Boolean);
            if (words.length < 3) return false;
            let matched = 0;
            words.forEach((word) => {
                if (smsWordToIndex.has(word)) matched += 1;
            });
            return matched / words.length > 0.5;
        }

        async function encodeSmsMiniMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeSmsMini(bytes);
        }

        async function decodeSmsMiniMode(text, password) {
            const bytes = decodeSmsMini(text);
            return unpackV2(bytes, password);
        }

        function detectSmsMini(text) {
            const codeMatch = text.match(/\b\d{5,6}\b/);
            const tagMatch = text.match(/#[A-Za-z]{6,}/);
            return !!codeMatch && !!tagMatch;
        }

        async function encodeStealthMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeNamNam(bytes);
        }

        async function decodeStealthMode(text, password) {
            const bytes = decodeNamNam(text);
            return unpackV2(bytes, password);
        }

        function detectStealth(text) {
            return detectNamNam(text);
        }

        async function encodeEmojiMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeEmojiOnly(bytes);
        }

        async function decodeEmojiMode(text, password) {
            const bytes = decodeEmojiOnly(text);
            return unpackV2(bytes, password);
        }

        function detectEmoji(text) {
            if (!emojiIndexMap.size) return false;
            let bits = '';
            let emojiCount = 0;
            for (const ch of text) {
                if (!ch.trim()) continue;
                const idx = emojiIndexMap.get(ch);
                if (idx === undefined) return false;
                bits += idx.toString(2).padStart(emojiSymbolBits, '0');
                emojiCount += 1;
            }
            if (emojiCount < emojiMinCount) return false;
            try {
                bytesFromBitsWithLength(bits);
                return true;
            } catch (e) {
                return false;
            }
        }

        async function encodeHomoglyphMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeHomoglyph(bytes);
        }

        async function decodeHomoglyphMode(text, password) {
            const bytes = decodeHomoglyph(text);
            return unpackV2(bytes, password);
        }

        function detectHomoglyph(text) {
            const { altCount } = countHomoglyphStats(text);
            if (!altCount) return false;
            for (const group of emojiGroups) {
                for (const emoji of group) {
                    if (text.includes(emoji)) return false;
                }
            }
            return true;
        }

        async function encodeHomoglyphEmojiMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeHomoglyphEmoji(bytes);
        }

        async function decodeHomoglyphEmojiMode(text, password) {
            const bytes = decodeHomoglyphEmoji(text);
            return unpackV2(bytes, password);
        }

        function detectHomoglyphEmoji(text) {
            let hasEmoji = false;
            for (const group of emojiGroups) {
                for (const emoji of group) {
                    if (text.includes(emoji)) {
                        hasEmoji = true;
                        break;
                    }
                }
                if (hasEmoji) break;
            }
            if (!hasEmoji) return false;
            const { altCount } = countHomoglyphStats(text);
            return altCount > 0;
        }

        async function encodeFinglishMode(text, password) {
            const bytes = await packV2(text, password);
            return encodeFinglish(bytes);
        }

        async function decodeFinglishMode(text, password) {
            const bytes = decodeFinglish(text);
            return unpackV2(bytes, password);
        }

        function detectFinglish(text) {
            const words = text.toLowerCase().replace(/[!?,\.]/g, ' ').split(/\s+/).filter(Boolean);
            if (words.length < 3) return false;
            let matched = 0;
            for (const word of words) {
                for (const entry of finglishWords) {
                    if (entry.variants?.some((v) => v.toLowerCase() === word)) {
                        matched += 1;
                        break;
                    }
                }
            }
            return matched / words.length > 0.5;
        }

        async function encodeLegacyMode(text, password) {
            const bytes = await packLegacy(text, password);
            return encodeLegacy(bytes);
        }

        async function decodeLegacyMode(text, password) {
            const bytes = decodeLegacy(text);
            return unpackLegacy(bytes, password);
        }

        function detectLegacy(text) {
            const tokens = text.trim().split(/\s+/).filter(Boolean);
            if (tokens.length < 4) return false;
            let matched = 0;
            tokens.forEach((token) => {
                if (legacyTokenToIndex.has(token)) matched += 1;
            });
            return matched / tokens.length > 0.5;
        }

        function encodePersianMap(text) {
            let result = '';
            for (const char of text) {
                const isUpper = char >= 'A' && char <= 'Z';
                const lower = char.toLowerCase();
                if (persianMap[lower]) {
                    result += isUpper ? capitalMarker + persianMap[lower] : persianMap[lower];
                } else if (persianMap[char]) {
                    result += persianMap[char];
                } else {
                    result += char;
                }
            }
            return result;
        }

        function decodePersianMap(text) {
            let result = '';
            let nextUpper = false;
            for (const char of text) {
                if (char === capitalMarker) {
                    nextUpper = true;
                    continue;
                }
                if (persianReverse[char]) {
                    const decoded = persianReverse[char];
                    result += nextUpper ? decoded.toUpperCase() : decoded;
                    nextUpper = false;
                } else {
                    result += char;
                    nextUpper = false;
                }
            }
            return result;
        }

        function encodeSentence(bytes) {
            if (!byteWords.length) throw new Error('NO_SENTENCE_WORDS');
            const withLen = addLengthPrefix(bytes);
            const words = Array.from(withLen, (b) => byteWords[b] || '');
            const groups = [];
            for (let i = 0; i < words.length; i += 3) {
                groups.push(words.slice(i, i + 3).filter(Boolean).join(' '));
            }
            return groups.filter(Boolean).join('. ');
        }

        function decodeSentence(text) {
            const words = splitWords(text);
            if (!words.length) throw new Error('SENTENCE_TOO_SHORT');
            const bytes = [];
            for (const word of words) {
                const idx = byteWordToIndex.get(word);
                if (idx === undefined) throw new Error('SENTENCE_BAD_TOKEN');
                bytes.push(idx);
            }
            if (bytes.length < 2) throw new Error('SENTENCE_TOO_SHORT');
            return readLengthPrefixedBytes(bytes);
        }

        function encodeZwc(bytes, carrierText) {
            const bits = bytesToBitsWithLength(bytes);
            let zwcString = '';
            for (const bit of bits) {
                zwcString += bit === '1' ? zwcBinaryChars[1] : zwcBinaryChars[0];
            }
            const carrier = carrierText || '';
            if (!carrier) return zwcString;
            const chars = Array.from(carrier);
            if (chars.length < 2) return carrier + zwcString;
            const positions = [];
            for (let i = 0; i < chars.length - 1; i++) {
                if (/\s/.test(chars[i]) || /[.,!?;:\u060c\u061b]/.test(chars[i])) {
                    positions.push(i + 1);
                }
            }
            if (!positions.length) {
                for (let i = 0; i < chars.length - 1; i++) {
                    positions.push(i + 1);
                }
            }
            const base = Math.floor(zwcString.length / positions.length);
            let extra = zwcString.length % positions.length;
            const inserts = new Map();
            let idx = 0;
            for (const pos of positions) {
                const take = base + (extra > 0 ? 1 : 0);
                if (take) {
                    inserts.set(pos, zwcString.slice(idx, idx + take));
                    idx += take;
                }
                if (extra > 0) extra -= 1;
                if (idx >= zwcString.length) break;
            }
            let out = '';
            for (let i = 0; i < chars.length; i++) {
                out += chars[i];
                const insert = inserts.get(i + 1);
                if (insert) out += insert;
            }
            if (idx < zwcString.length) {
                out = zwcString.slice(idx) + out;
            }
            return out;
        }

        function decodeZwcBinary(text) {
            let bits = '';
            for (const ch of text) {
                if (ch === zwcBinaryChars[0]) bits += '0';
                else if (ch === zwcBinaryChars[1]) bits += '1';
            }
            if (bits.length < 16) throw new Error('ZWC_TOO_SHORT');
            return bytesFromBitsWithLength(bits);
        }

        function decodeZwcBase4(text, chars) {
            let zwcString = '';
            for (const ch of text) {
                if (chars.includes(ch)) zwcString += ch;
            }
            if (zwcString.length < 8) throw new Error('ZWC_TOO_SHORT');
            const bytes = [];
            for (let i = 0; i + 3 < zwcString.length; i += 4) {
                const b0 = chars.indexOf(zwcString[i]);
                const b1 = chars.indexOf(zwcString[i + 1]);
                const b2 = chars.indexOf(zwcString[i + 2]);
                const b3 = chars.indexOf(zwcString[i + 3]);
                if (b0 < 0 || b1 < 0 || b2 < 0 || b3 < 0) throw new Error('ZWC_BAD_TOKEN');
                bytes.push((b0 << 6) | (b1 << 4) | (b2 << 2) | b3);
            }
            return readLengthPrefixedBytes(bytes);
        }

        function decodeZwcBase4Any(text) {
            const decodeSets = [zwcModernChars, zwcLegacyChars];
            let lastError = null;
            for (const chars of decodeSets) {
                try {
                    return decodeZwcBase4(text, chars);
                } catch (err) {
                    lastError = err;
                }
            }
            throw lastError || new Error('ZWC_BAD_TOKEN');
        }

        function encodeSmsCompact(bytes) {
            if (!smsWords.length) throw new Error('NO_SMS_WORDS');
            const bits = bytesToBitsWithLength(bytes);
            const words = [];
            for (let i = 0; i < bits.length; i += 6) {
                const chunk = bits.slice(i, i + 6).padEnd(6, '0');
                const idx = parseInt(chunk, 2);
                words.push(smsWords[idx]);
            }
            return words.join(' ');
        }

        function decodeSmsCompact(text) {
            const inputWords = text.split(/\s+/).filter((word) => smsWordToIndex.has(word));
            if (inputWords.length < 3) throw new Error('SMS_COMPACT_TOO_SHORT');
            let bits = '';
            inputWords.forEach((word) => {
                const idx = smsWordToIndex.get(word);
                bits += idx.toString(2).padStart(6, '0');
            });
            return bytesFromBitsWithLength(bits);
        }

        function encodeSmsMini(bytes) {
            const salt = randomBytes(smsMiniSaltLength);
            const codeLength = Math.random() < 0.5 ? 5 : 6;
            const template = smsMiniTemplates[Math.floor(Math.random() * smsMiniTemplates.length)];
            const templateHash = computeSmsMiniTemplateHash(template);

            const payload = new Uint8Array(smsMiniSaltLength + 1 + smsMiniHashLength + bytes.length);
            let offset = 0;
            payload.set(salt, offset);
            offset += smsMiniSaltLength;
            payload[offset++] = codeLength;
            writeUint32BE(payload, offset, templateHash);
            offset += smsMiniHashLength;
            payload.set(bytes, offset);

            const tag = bytesToBase52(payload);
            const code = computeSmsMiniCode(payload, codeLength);
            return fillSmsMiniTemplate(template, { code, tag });
        }

        function decodeSmsMini(text) {
            const codeMatch = text.match(/\b(\d{5,6})\b/);
            const tagMatch = text.match(/#([A-Za-z]{6,})/);
            if (!codeMatch || !tagMatch) throw new Error('SMS_MINI_MISSING');
            const code = codeMatch[1];
            const tag = tagMatch[1];
            const payload = base52ToBytes(tag);
            const metaSize = smsMiniSaltLength + 1 + smsMiniHashLength;
            if (payload.length < metaSize + 2) throw new Error('SMS_MINI_BAD_TAG');

            const codeLength = payload[smsMiniSaltLength];
            if (codeLength !== code.length) throw new Error('SMS_MINI_CODE_MISMATCH');

            const expected = computeSmsMiniCode(payload, codeLength);
            if (code !== expected) throw new Error('SMS_MINI_CODE_MISMATCH');

            const templateHash = readUint32BE(payload, smsMiniSaltLength + 1);
            const normalized = normalizeSmsMiniMessage(text, code, tag);
            const normalizedHash = hashString32(normalized);
            if (templateHash !== normalizedHash) throw new Error('SMS_MINI_TAMPERED');

            const isValidPackHeader = (bytes) => {
                if (!bytes || bytes.length < 2) return false;
                if (bytes[0] !== 2) return false;
                return (bytes[1] & ~0x13) === 0;
            };

            let raw = payload.slice(metaSize);
            if (raw.length < 2) throw new Error('SMS_MINI_BAD_TAG');
            if (!isValidPackHeader(raw)) {
                const legacyLen = (raw[0] << 8) | raw[1];
                if (legacyLen === raw.length - 2) {
                    const candidate = raw.slice(2);
                    if (isValidPackHeader(candidate)) {
                        raw = candidate;
                    }
                }
            }
            if (!isValidPackHeader(raw)) throw new Error('SMS_MINI_BAD_TAG');
            return raw;
        }

        function parseNamNamBitsWithTokens(text, tokensByLength, extraSet) {
            const compact = (text || '').replace(/\s+/g, '');
            if (!compact) return { bits: '', invalid: false, usedExtra: false };
            let bits = '';
            let i = 0;
            let usedExtra = false;
            while (i < compact.length) {
                let matched = false;
                for (const entry of tokensByLength) {
                    if (compact.startsWith(entry.token, i)) {
                        bits += entry.bits;
                        i += entry.token.length;
                        matched = true;
                        if (extraSet && extraSet.has(entry.token)) usedExtra = true;
                        break;
                    }
                }
                if (!matched) return { bits: '', invalid: true, usedExtra };
            }
            return { bits, invalid: false, usedExtra };
        }

        function parseNamNamBits(text) {
            const v4 = parseNamNamBitsWithTokens(text, namNamTokensV4ByLength, namNamTokensV4ExtraSet);
            if (!v4.invalid) {
                if (v4.usedExtra) return { bits: v4.bits, invalid: false };
                const v2 = parseNamNamBitsWithTokens(text, namNamTokensV2ByLength);
                if (!v2.invalid) return { bits: v2.bits, invalid: false };
                return { bits: v4.bits, invalid: false };
            }
            const v2 = parseNamNamBitsWithTokens(text, namNamTokensV2ByLength);
            if (!v2.invalid) return { bits: v2.bits, invalid: false };
            const legacy = parseNamNamBitsWithTokens(text, legacyNamNamTokensByLength);
            if (!legacy.invalid) return { bits: legacy.bits, invalid: false };
            return { bits: '', invalid: true };
        }

        function bytesToBitsWithLengthCompact(bytes) {
            const len = bytes.length;
            if (len > 255) return bytesToBitsWithLength(bytes);
            let bits = len.toString(2).padStart(8, '0');
            for (const b of bytes) bits += b.toString(2).padStart(8, '0');
            return bits;
        }

        function bytesFromBitsWithLengthCompact(bits) {
            if (bits.length < 8) throw new Error('BITS_TOO_SHORT');
            const len = parseInt(bits.slice(0, 8), 2);
            const needed = 8 + len * 8;
            if (bits.length !== needed) throw new Error('BITS_BAD_LENGTH');
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                const start = 8 + i * 8;
                bytes[i] = parseInt(bits.slice(start, start + 8), 2);
            }
            return bytes;
        }

        function encodeNamNam(bytes) {
            const bits = bytesToBitsWithLengthCompact(bytes);
            const tokens = [];
            for (let i = 0; i < bits.length; i += 4) {
                const chunk = bits.slice(i, i + 4);
                const idx = parseInt(chunk, 2);
                tokens.push(namNamTokensV4[idx].token);
            }
            return tokens.join(' ');
        }

        function decodeNamNamBits(bits) {
            if (bits.length < 8) throw new Error('NAM_NAM_TOO_SHORT');
            let bytes;
            try {
                bytes = bytesFromBitsWithLengthCompact(bits);
            } catch (err) {
                if (bits.length < 16) throw new Error('NAM_NAM_TOO_SHORT');
                bytes = bytesFromBitsWithLength(bits);
            }
            if (!bytes || bytes.length < 2 || bytes[0] !== 2) throw new Error('NAM_NAM_BAD_PAYLOAD');
            return bytes;
        }

        function decodeNamNam(text) {
            let lastError = null;
            const v4 = parseNamNamBitsWithTokens(text, namNamTokensV4ByLength, namNamTokensV4ExtraSet);
            if (!v4.invalid) {
                if (v4.usedExtra) {
                    try {
                        return decodeNamNamBits(v4.bits);
                    } catch (err) {
                        lastError = err;
                    }
                } else {
                    const v2 = parseNamNamBitsWithTokens(text, namNamTokensV2ByLength);
                    if (!v2.invalid) {
                        try {
                            return decodeNamNamBits(v2.bits);
                        } catch (err) {
                            lastError = err;
                        }
                    }
                    try {
                        return decodeNamNamBits(v4.bits);
                    } catch (err) {
                        lastError = err;
                    }
                }
            }
            const legacy = parseNamNamBitsWithTokens(text, legacyNamNamTokensByLength);
            if (!legacy.invalid) {
                try {
                    return decodeNamNamBits(legacy.bits);
                } catch (err) {
                    lastError = err;
                }
            }
            if (v4.invalid && legacy.invalid) throw new Error('NAM_NAM_BAD_CHAR');
            throw lastError || new Error('NAM_NAM_BAD_PAYLOAD');
        }

        function detectNamNam(text) {
            const { bits, invalid } = parseNamNamBits(text);
            if (invalid) return false;
            return bits.length >= 12;
        }

        function encodeEmojiOnly(bytes) {
            if (!emojiSymbols.length) throw new Error('EMOJI_DISABLED');
            const bits = bytesToBitsWithLength(bytes);
            const emojis = [];
            for (let i = 0; i < bits.length; i += emojiSymbolBits) {
                const chunk = bits.slice(i, i + emojiSymbolBits).padEnd(emojiSymbolBits, '0');
                const emoji = emojiSymbols[parseInt(chunk, 2)];
                if (!emoji) throw new Error('EMOJI_DISABLED');
                emojis.push(emoji);
            }
            return emojis.join('');
        }

        function decodeEmojiOnly(text) {
            if (!emojiIndexMap.size) throw new Error('EMOJI_DISABLED');
            let bits = '';
            let emojiCount = 0;
            for (const ch of text) {
                if (!ch.trim()) continue;
                const idx = emojiIndexMap.get(ch);
                if (idx === undefined) throw new Error('EMOJI_BAD_CHAR');
                bits += idx.toString(2).padStart(emojiSymbolBits, '0');
                emojiCount += 1;
            }
            if (emojiCount < emojiMinCount || bits.length < 16) throw new Error('EMOJI_TOO_SHORT');
            return bytesFromBitsWithLength(bits);
        }

        function encodeHomoglyph(bytes) {
            const bits = bytesToBitsWithLength(bytes);
            const carrier = buildCarrier(bits.length);
            return applyHomoglyphBits(carrier, bits);
        }

        function decodeHomoglyph(text) {
            const bits = extractHomoglyphBits(text);
            return bytesFromBitsWithLength(bits);
        }

        function encodeHomoglyphEmoji(bytes) {
            const bits = bytesToBitsWithLength(bytes);
            const groupCount = Math.min(3, emojiGroups.length);
            let prefixBits = bits.slice(0, groupCount * 2).padEnd(groupCount * 2, '0');
            const prefixEmojis = [];
            for (let g = 0; g < groupCount; g++) {
                const idx = parseInt(prefixBits.slice(g * 2, g * 2 + 2), 2);
                const group = emojiGroups[g] || [];
                prefixEmojis.push(group[idx] || '');
            }
            const remainingBits = bits.slice(groupCount * 2);
            const carrier = buildCarrier(remainingBits.length + 64);
            const body = applyHomoglyphBits(carrier, remainingBits);
            return `${prefixEmojis.filter(Boolean).join(' ')} ${body}`.trim();
        }

        function decodeHomoglyphEmoji(text) {
            let bits = '';
            const groupCount = Math.min(3, emojiGroups.length);
            for (let g = 0; g < groupCount; g++) {
                let groupBits = '00';
                const group = emojiGroups[g] || [];
                for (let i = 0; i < group.length; i++) {
                    if (text.includes(group[i])) {
                        groupBits = i.toString(2).padStart(2, '0');
                        break;
                    }
                }
                bits += groupBits;
            }
            bits += extractHomoglyphBits(text);
            return bytesFromBitsWithLength(bits);
        }

        function encodeFinglish(bytes) {
            const bits = bytesToBitsWithLength(bytes);
            const words = [];
            let bitIndex = 0;
            for (let i = 0; i < finglishWords.length && bitIndex + 2 <= bits.length; i++) {
                const chunk = bits.slice(bitIndex, bitIndex + 2);
                const val = parseInt(chunk, 2);
                const variants = finglishWords[i].variants || [];
                words.push(variants[val] || variants[0]);
                bitIndex += 2;
            }
            if (bitIndex < bits.length) throw new Error('FINGLISH_TOO_LARGE');
            const template = finglishTemplates[Math.floor(Math.random() * Math.max(1, finglishTemplates.length))] || '{0} {1} {2} {3} {4}';
            let result = template;
            for (let i = 0; i < 5 && i < words.length; i++) {
                result = result.replace(`{${i}}`, words[i]);
            }
            if (words.length > 5) result += ' ' + words.slice(5).join(' ');
            for (let i = 0; i < 5; i++) {
                result = result.replace(`{${i}}`, '').trim();
            }
            return result.replace(/\s+/g, ' ').trim();
        }

        function decodeFinglish(text) {
            const inputWords = text.toLowerCase().replace(/[!?,.]/g, ' ').split(/\s+/).filter(Boolean);
            let bits = '';
            for (const word of inputWords) {
                let matched = false;
                for (const entry of finglishWords) {
                    const variants = entry.variants || [];
                    const index = variants.findIndex((v) => v.toLowerCase() === word);
                    if (index !== -1) {
                        bits += index.toString(2).padStart(2, '0');
                        matched = true;
                        break;
                    }
                }
                if (!matched) throw new Error('FINGLISH_BAD_TOKEN');
            }
            return bytesFromBitsWithLength(bits);
        }

        function encodeLegacy(bytes) {
            const withLen = addLengthPrefix32(bytes);
            return Array.from(withLen, (b) => legacyTokens[b]).join(' ');
        }

        function decodeLegacy(text) {
            const tokens = text.trim().split(/\s+/).filter(Boolean);
            if (!tokens.length) throw new Error('LEGACY_EMPTY');
            const out = new Uint8Array(tokens.length);
            for (let i = 0; i < tokens.length; i++) {
                const idx = legacyTokenToIndex.get(tokens[i]);
                if (idx === undefined) throw new Error('LEGACY_BAD_TOKEN');
                out[i] = idx;
            }
            if (out.length < 4) throw new Error('LEGACY_TOO_SHORT');
            const len = ((out[0] << 24) | (out[1] << 16) | (out[2] << 8) | out[3]) >>> 0;
            const payload = out.slice(4);
            if (payload.length < len) throw new Error('LEGACY_BAD_LENGTH');
            return payload.slice(0, len);
        }

        function countHomoglyphStats(text) {
            let baseCount = 0;
            let altCount = 0;
            for (const ch of text) {
                if (homoglyphBaseIndex.has(ch)) baseCount += 1;
                else if (homoglyphAltIndex.has(ch)) altCount += 1;
            }
            return { baseCount, altCount };
        }

        function applyHomoglyphBits(carrier, bits) {
            if (!carrier) throw new Error('HOMOGLYPH_CARRIER_EMPTY');
            let out = '';
            let bitIdx = 0;
            for (const ch of carrier) {
                const idx = homoglyphBaseIndex.get(ch);
                if (idx !== undefined && bitIdx < bits.length) {
                    const bit = bits[bitIdx] === '1' ? 1 : 0;
                    out += homoglyphPairs[idx][bit];
                    bitIdx += 1;
                } else {
                    out += ch;
                }
            }
            if (bitIdx < bits.length) throw new Error('HOMOGLYPH_CAPACITY');
            return out;
        }

        function extractHomoglyphBits(text) {
            let bits = '';
            for (const ch of text) {
                const baseIdx = homoglyphBaseIndex.get(ch);
                if (baseIdx !== undefined) {
                    bits += '0';
                    continue;
                }
                const altIdx = homoglyphAltIndex.get(ch);
                if (altIdx !== undefined) bits += '1';
            }
            return bits;
        }

        function pickCarrierWithCapacity(templates, neededBits) {
            if (!homoglyphBaseIndex.size) throw new Error('HOMOGLYPH_DISABLED');
            let best = '';
            let bestCount = 0;
            templates.forEach((tpl) => {
                const count = countCarrierCapacity(tpl);
                if (count >= neededBits && (bestCount === 0 || tpl.length < best.length)) {
                    best = tpl;
                    bestCount = count;
                }
            });
            if (best) return best;
            if (!templates.length) return buildCarrier(neededBits);
            let combined = '';
            let count = 0;
            let idx = 0;
            while (count < neededBits && idx < templates.length * 50) {
                const tpl = templates[idx % templates.length];
                combined += (combined ? ' ' : '') + tpl;
                count += countCarrierCapacity(tpl);
                idx += 1;
            }
            return combined || buildCarrier(neededBits);
        }

        function countCarrierCapacity(text) {
            let count = 0;
            for (const ch of text) {
                if (homoglyphBaseIndex.has(ch)) count += 1;
            }
            return count;
        }

        function buildCarrier(neededBits) {
            if (!byteWords.length) {
                const bases = Array.from(homoglyphBaseIndex.keys());
                if (!bases.length) return '';
                return bases.join(' ').repeat(Math.ceil(neededBits / bases.length));
            }
            const bases = Array.from(homoglyphBaseIndex.keys());
            const candidates = byteWords.filter((word) => bases.some((b) => word.includes(b)));
            const pool = candidates.length ? candidates : byteWords;
            let out = '';
            let count = 0;
            let idx = 0;
            while (count < neededBits && idx < pool.length * 50) {
                const word = pool[idx % pool.length];
                out += (out ? ' ' : '') + word;
                count += countCarrierCapacity(word);
                idx += 1;
            }
            if (count < neededBits) {
                const fallback = bases.join(' ');
                while (count < neededBits) {
                    out += (out ? ' ' : '') + fallback;
                    count += bases.length;
                }
            }
            return out.trim();
        }

        function bytesToBase64(bytes) {
            let bin = '';
            bytes.forEach((b) => { bin += String.fromCharCode(b); });
            return btoa(bin);
        }

        function base64ToBytes(str) {
            const bin = atob(str);
            const out = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
            return out;
        }

        function bytesToBase62(bytes) {
            let num = 1n;
            for (const b of bytes) num = num * 256n + BigInt(b);
            let result = '';
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            while (num > 0n) {
                result = chars[Number(num % 62n)] + result;
                num = num / 62n;
            }
            return result;
        }

        function base62ToBytes(str) {
            let num = 0n;
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (const ch of str) {
                const idx = chars.indexOf(ch);
                if (idx === -1) continue;
                num = num * 62n + BigInt(idx);
            }
            const bytes = [];
            while (num > 1n) {
                bytes.unshift(Number(num % 256n));
                num = num / 256n;
            }
            return new Uint8Array(bytes);
        }

        function bytesToBase52(bytes) {
            let num = 1n;
            for (const b of bytes) num = num * 256n + BigInt(b);
            let result = '';
            const chars = smsMiniAlphabet;
            while (num > 0n) {
                result = chars[Number(num % 52n)] + result;
                num = num / 52n;
            }
            return result;
        }

        function base52ToBytes(str) {
            let num = 0n;
            const chars = smsMiniAlphabet;
            for (const ch of str) {
                const idx = chars.indexOf(ch);
                if (idx === -1) throw new Error('SMS_MINI_BAD_TAG');
                num = num * 52n + BigInt(idx);
            }
            const bytes = [];
            while (num > 1n) {
                bytes.unshift(Number(num % 256n));
                num = num / 256n;
            }
            return new Uint8Array(bytes);
        }

        function normalizeSmsMiniText(text) {
            return (text || '').replace(/\r\n?/g, '\n');
        }

        function normalizeSmsMiniMessage(text, code, tag) {
            let normalized = normalizeSmsMiniText(text);
            if (code) {
                const idx = normalized.indexOf(code);
                if (idx === -1) throw new Error('SMS_MINI_CODE_MISSING');
                normalized = normalized.slice(0, idx) + smsMiniCodeMarker + normalized.slice(idx + code.length);
            }
            if (tag) {
                const tagToken = `#${tag}`;
                const idx = normalized.indexOf(tagToken);
                if (idx === -1) throw new Error('SMS_MINI_TAG_MISSING');
                normalized = normalized.slice(0, idx) + smsMiniTagMarker + normalized.slice(idx + tagToken.length);
            }
            return normalized;
        }

        function computeSmsMiniTemplateHash(template) {
            return hashString32(normalizeSmsMiniText(template));
        }

        function writeUint32BE(bytes, offset, value) {
            bytes[offset] = (value >>> 24) & 0xff;
            bytes[offset + 1] = (value >>> 16) & 0xff;
            bytes[offset + 2] = (value >>> 8) & 0xff;
            bytes[offset + 3] = value & 0xff;
        }

        function readUint32BE(bytes, offset) {
            return (
                ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3])
                >>> 0
            );
        }

        function hashBytes32(bytes) {
            let hash = 2166136261;
            for (const b of bytes) {
                hash ^= b;
                hash = Math.imul(hash, 16777619);
            }
            return hash >>> 0;
        }

        function hashString32(value) {
            return hashBytes32(enc.encode(value));
        }

        function computeSmsMiniCode(bytes, length) {
            const mod = length === 5 ? 100000 : 1000000;
            const value = hashBytes32(bytes) % mod;
            return String(value).padStart(length, '0');
        }

        function fillSmsMiniTemplate(template, data) {
            return template.replace(/\{(\w+)\}/g, (match, key) => data[key] ?? '');
        }

        function bytesToBitsWithLength(bytes) {
            const len = bytes.length;
            let bits = ((len >> 8) & 0xff).toString(2).padStart(8, '0');
            bits += (len & 0xff).toString(2).padStart(8, '0');
            for (const b of bytes) bits += b.toString(2).padStart(8, '0');
            return bits;
        }

        function bytesFromBitsWithLength(bits) {
            if (bits.length < 16) throw new Error('BITS_TOO_SHORT');
            const lenHigh = parseInt(bits.slice(0, 8), 2);
            const lenLow = parseInt(bits.slice(8, 16), 2);
            const len = (lenHigh << 8) | lenLow;
            const needed = 16 + len * 8;
            if (bits.length < needed) throw new Error('BITS_TOO_SHORT');
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                const start = 16 + i * 8;
                bytes[i] = parseInt(bits.slice(start, start + 8), 2);
            }
            return bytes;
        }

        function addLengthPrefix(bytes) {
            const len = bytes.length;
            const out = new Uint8Array(2 + len);
            out[0] = (len >> 8) & 0xff;
            out[1] = len & 0xff;
            out.set(bytes, 2);
            return out;
        }

        function readLengthPrefixedBytes(bytesLike) {
            const bytes = bytesLike instanceof Uint8Array ? bytesLike : Uint8Array.from(bytesLike);
            if (bytes.length < 2) throw new Error('BAD_LENGTH');
            const len = (bytes[0] << 8) | bytes[1];
            if (bytes.length < 2 + len) throw new Error('BAD_LENGTH');
            return bytes.slice(2, 2 + len);
        }

        function addLengthPrefix32(bytes) {
            const len = bytes.length;
            const out = new Uint8Array(4 + len);
            out[0] = (len >>> 24) & 0xff;
            out[1] = (len >>> 16) & 0xff;
            out[2] = (len >>> 8) & 0xff;
            out[3] = len & 0xff;
            out.set(bytes, 4);
            return out;
        }

        function buildReverseMap(map) {
            const reverse = Object.create(null);
            Object.keys(map).forEach((key) => {
                const value = map[key];
                if (value && reverse[value] === undefined) reverse[value] = key;
            });
            return reverse;
        }

        function splitWords(text) {
            return text.split(/[\s,.;:!?]+/).filter(Boolean);
        }

        function looksLikeBase64(text) {
            const compact = text.replace(/\s+/g, '');
            if (compact.length < 16 || compact.length % 4 !== 0) return false;
            return /^[A-Za-z0-9+/=]+$/.test(compact);
        }

        function isSafeWord(word) {
            return /^[\u0600-\u06FF\u200C]+$/.test(word);
        }

        function isSafeEmoji(emoji) {
            if (emoji.includes('\u200D') || emoji.includes('\uFE0F')) return false;
            return !/\s/.test(emoji);
        }

        function pickUnique(list, count, predicate) {
            const out = [];
            const seen = new Set();
            for (const item of list) {
                if (predicate && !predicate(item)) continue;
                if (seen.has(item)) continue;
                seen.add(item);
                out.push(item);
                if (out.length >= count) break;
            }
            return out;
        }

        function buildLegacyTokens(payload) {
            const words64 = Array.isArray(payload.LEGACY_WORDS_64) ? payload.LEGACY_WORDS_64 : [];
            const pool = Array.isArray(payload.LEGACY_WORDS_POOL) ? payload.LEGACY_WORDS_POOL : [];
            const emojiPool = Array.isArray(payload.LEGACY_EMOJI_POOL) ? payload.LEGACY_EMOJI_POOL : [];
            const words = pickUnique(words64.concat(pool), 128, isSafeWord);
            const emojis = pickUnique(emojiPool, 128, isSafeEmoji);
            return words.concat(emojis);
        }

        async function packV2(text, password) {
            const raw = enc.encode(text);
            const { payload, compressed } = await maybeCompress(raw);
            const encrypted = !!password;
            let flags = compressed ? 1 : 0;
            let finalPayload = payload;
            if (encrypted) {
                const useAes = hasWebCrypto && crypto?.subtle;
                if (useAes) {
                    finalPayload = await aesEncryptPayload(payload, password);
                    flags |= 2 | 16;
                } else {
                    finalPayload = xorEncryptPayload(payload, password);
                    flags |= 2;
                }
            }
            const out = new Uint8Array(2 + finalPayload.length);
            out[0] = 2;
            out[1] = flags;
            out.set(finalPayload, 2);
            return out;
        }

        async function unpackV2(bytes, password) {
            if (bytes.length < 2) throw new Error('PACK_TOO_SHORT');
            if (bytes[0] !== 2) throw new Error('PACK_VERSION');
            const flags = bytes[1];
            const compressed = (flags & 1) === 1;
            const encrypted = (flags & 2) === 2;
            const secure = (flags & 16) === 16;
            let payload = bytes.slice(2);
            if (encrypted) {
                if (!password) throw new Error('PASSWORD_REQUIRED');
                payload = secure ? await aesDecryptPayload(payload, password) : xorDecryptPayload(payload, password);
            }
            const raw = compressed ? await gzipDecompress(payload) : payload;
            return dec.decode(raw);
        }

        async function packLegacy(text, password) {
            const raw = enc.encode(text);
            const { payload, compressed } = await maybeCompress(raw);
            const encrypted = !!password;
            let flags = compressed ? 2 : 0;
            let finalPayload = payload;
            if (encrypted) {
                if (!hasWebCrypto || !crypto?.subtle) throw new Error('PASSWORD_UNAVAILABLE');
                finalPayload = await aesEncryptPayload(payload, password);
                flags |= 1;
            }
            const out = new Uint8Array(2 + finalPayload.length);
            out[0] = 1;
            out[1] = flags;
            out.set(finalPayload, 2);
            return out;
        }

        async function unpackLegacy(bytes, password) {
            if (bytes.length < 2) throw new Error('PACK_TOO_SHORT');
            if (bytes[0] !== 1) throw new Error('PACK_VERSION');
            const flags = bytes[1];
            const encrypted = (flags & 1) === 1;
            const compressed = (flags & 2) === 2;
            let payload = bytes.slice(2);
            if (encrypted) {
                if (!password) throw new Error('PASSWORD_REQUIRED');
                if (!hasWebCrypto || !crypto?.subtle) throw new Error('PASSWORD_UNAVAILABLE');
                payload = await aesDecryptPayload(payload, password);
            }
            const raw = compressed ? await gzipDecompress(payload) : payload;
            return dec.decode(raw);
        }

        async function maybeCompress(bytes) {
            if (!('CompressionStream' in window) || bytes.length <= 50) {
                return { payload: bytes, compressed: false };
            }
            try {
                const gz = await gzipCompress(bytes);
                if (gz.length < bytes.length) return { payload: gz, compressed: true };
            } catch (e) {
                return { payload: bytes, compressed: false };
            }
            return { payload: bytes, compressed: false };
        }

        async function gzipCompress(bytes) {
            const cs = new CompressionStream('gzip');
            const stream = new Blob([bytes]).stream().pipeThrough(cs);
            const ab = await new Response(stream).arrayBuffer();
            return new Uint8Array(ab);
        }

        async function gzipDecompress(bytes) {
            if (!('DecompressionStream' in window)) return bytes;
            const ds = new DecompressionStream('gzip');
            const stream = new Blob([bytes]).stream().pipeThrough(ds);
            const ab = await new Response(stream).arrayBuffer();
            return new Uint8Array(ab);
        }

        async function aesEncryptPayload(payload, password) {
            const salt = randomBytes(16);
            const iv = randomBytes(12);
            const key = await deriveAesKey(password, salt);
            const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, payload);
            const cipher = new Uint8Array(cipherBuffer);
            const out = new Uint8Array(16 + 12 + cipher.length);
            out.set(salt, 0);
            out.set(iv, 16);
            out.set(cipher, 28);
            return out;
        }

        async function aesDecryptPayload(payload, password) {
            if (payload.length < 29) throw new Error('AES_TOO_SHORT');
            const salt = payload.slice(0, 16);
            const iv = payload.slice(16, 28);
            const cipher = payload.slice(28);
            const key = await deriveAesKey(password, salt);
            const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
            return new Uint8Array(plainBuffer);
        }

        async function deriveAesKey(password, salt) {
            const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
            return crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
        }

        function xorEncryptPayload(payload, password) {
            const salt = randomBytes(8);
            const key = simpleHash32(password, salt);
            const out = new Uint8Array(8 + payload.length);
            out.set(salt, 0);
            for (let i = 0; i < payload.length; i++) {
                out[8 + i] = payload[i] ^ key[i % key.length];
            }
            return out;
        }

        function xorDecryptPayload(payload, password) {
            if (payload.length < 9) throw new Error('XOR_TOO_SHORT');
            const salt = payload.slice(0, 8);
            const cipher = payload.slice(8);
            const key = simpleHash32(password, salt);
            const out = new Uint8Array(cipher.length);
            for (let i = 0; i < cipher.length; i++) {
                out[i] = cipher[i] ^ key[i % key.length];
            }
            return out;
        }

        function simpleHash32(password, salt) {
            let seed = password;
            for (const b of salt) seed += String.fromCharCode(b);
            const bytes = enc.encode(seed);
            const out = new Uint8Array(32);
            for (let i = 0; i < bytes.length; i++) {
                const idx = i % 32;
                out[idx] ^= bytes[i];
                out[(i + 1) % 32] = (out[(i + 1) % 32] + bytes[i]) & 0xff;
                out[(i + 7) % 32] ^= ((bytes[i] << 3) | (bytes[i] >> 5)) & 0xff;
            }
            for (let round = 0; round < 100; round++) {
                for (let i = 0; i < 32; i++) {
                    out[i] = (out[i] + out[(i + 1) % 32] * 31) & 0xff;
                    out[(i + 17) % 32] ^= out[i];
                }
            }
            return out;
        }

        return { patterns, encodeText, decodeText };
    }


    async function doEncode() {
        const inputEl = document.getElementById('input-send');
        const outputEl = document.getElementById('output-send');
        if (!inputEl || !outputEl) return;

        const text = inputEl.value || '';
        if (!text) {
            outputEl.value = '';
            delete outputEl.dataset.raw;
            lastEncodedOutput = '';
            updateCharCounter(0);
            return;
        }

        try {
            const pwd = currentPassword.trim();
            const patternId = resolvePatternId(currentPattern);
            const encoded = await patternRegistry.encodeText(text, pwd, patternId);
            lastEncodedOutput = encoded;
            if (patternId === 'zwc') {
                outputEl.value = stripZwcForDisplay(encoded);
                outputEl.dataset.raw = encoded;
            } else {
                outputEl.value = encoded;
                delete outputEl.dataset.raw;
            }
            renderChunks(encoded, patternId === 'zwc');
            updateCharCounter(encoded.length);
        } catch (err) {
            outputEl.value = '';
            delete outputEl.dataset.raw;
            lastEncodedOutput = '';
            updateCharCounter(0);
            showToast(t('toast_encode_failed'));
        }
    }

    async function doDecode() {
        const inputEl = document.getElementById('input-receive');
        const outputEl = document.getElementById('output-receive');
        if (!inputEl || !outputEl) return;

        const text = (inputEl.value || '').trim();
        if (!text) {
            outputEl.value = '';
            return;
        }

        try {
            const pwd = currentPassword.trim();
            const decoded = await patternRegistry.decodeText(text, pwd);
            outputEl.value = decoded;
        } catch (err) {
            outputEl.value = '';
            showToast(t('toast_decode_failed'));
        }
    }

    function renderChunks(encoded, stripZwc) {
        const outputWrap = document.getElementById('output-area-send');
        const copyWrap = document.getElementById('copy-send-wrapper');
        const chunkWrapper = document.getElementById('chunk-wrapper');
        const chunkList = document.getElementById('chunk-list');
        currentChunks = [];
        if (!chunkWrapper || !chunkList) return;

        if (!chunkingEnabled || encoded.length <= 201) {
            if (outputWrap) outputWrap.style.display = '';
            if (copyWrap) copyWrap.style.display = '';
            chunkWrapper.style.display = 'none';
            return;
        }

        currentChunks = [];
        for (let i = 0; i < encoded.length; i += 201) {
            currentChunks.push(encoded.slice(i, i + 201));
        }

        chunkList.innerHTML = '';
        currentChunks.forEach((chunk, idx) => {
            const item = document.createElement('div');
            item.className = 'chunk-item';
            const text = document.createElement('div');
            text.className = 'chunk-text';
            text.textContent = stripZwc ? stripZwcForDisplay(chunk) : chunk;
            const btn = document.createElement('button');
            btn.className = 'chunk-copy';
            btn.textContent = t('chunk_copy', { num: idx + 1 });
            btn.onclick = () => copyChunk(idx);
            item.appendChild(text);
            item.appendChild(btn);
            chunkList.appendChild(item);
        });

        if (outputWrap) outputWrap.style.display = 'none';
        if (copyWrap) copyWrap.style.display = 'none';
        chunkWrapper.style.display = 'block';
    }

    function updateCharCounter(len) {
        const el = document.getElementById('char-counter');
        if (!el) return;
        el.textContent = `${len}/201`;
        el.classList.remove('grey', 'orange', 'red');
        if (len > 201) {
            el.classList.add('red');
        } else if (len > 140) {
            el.classList.add('orange');
        } else {
            el.classList.add('grey');
        }
    }

    async function updatePassword(value) {
        const prevHadPassword = !!currentPassword;
        const normalized = toEnglishDigits(value || '');
        currentPassword = normalized;

        if (pinRecord && lockSatisfied && lastEnteredPin) {
            localStorage.removeItem('mixer_password');
            if (currentPassword) {
                try {
                    const encPwd = await encryptSecretWithPin(lastEnteredPin, currentPassword);
                    localStorage.setItem('mixer_password_enc', encPwd);
                } catch (e) {
                    console.error(e);
                }
            } else {
                localStorage.removeItem('mixer_password_enc');
            }
        } else if (!pinRecord) {
            if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
            else localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_password_enc');
        } else {
            localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_password_enc');
        }

        const nowHasPassword = !!currentPassword;
        if (nowHasPassword && !prevHadPassword) {
            showToast(t('toast_password_set'));
        } else if (!nowHasPassword && prevHadPassword) {
            showToast(t('toast_password_disabled'));
        }
        lastPasswordState = nowHasPassword;

        updatePasswordWarning();
        doEncode();
    }

    function updatePasswordWarning() {
        const warn = document.getElementById('password-warning');
        if (!warn) return;
        warn.style.display = currentPassword.trim() ? 'none' : 'block';
    }

    function setUpdateBanner(message) {
        const banners = document.querySelectorAll('[data-update-banner]');
        banners.forEach((banner) => {
            if (!message) {
                banner.textContent = '';
                banner.style.display = 'none';
            } else {
                banner.textContent = message;
                banner.style.display = 'block';
            }
        });
    }

    function buildUpdateMessage(info) {
        const rawVersion = info.version || '';
        const displayVersion = currentLang === 'fa' ? toPersianDigits(rawVersion) : rawVersion;
        const vars = { version: displayVersion };
        const hasLegacy = typeof info.message !== 'undefined';
        const rawTitle = hasLegacy ? (info.title || info.description) : info.title;
        const rawDesc = hasLegacy ? info.message : info.description;
        const titleText = formatTemplate(getLocalizedValue(rawTitle), vars).trim();
        const descText = formatTemplate(getLocalizedValue(rawDesc), vars).trim();
        return [titleText, descText].filter(Boolean).join('\n').trim();
    }

    function renderUpdateBanner() {
        if (!latestVersionInfo || !updateAvailable) {
            setUpdateBanner('');
            return;
        }
        setUpdateBanner(buildUpdateMessage(latestVersionInfo));
    }

    function updateAlertDismissLabels() {
        const label = t('alert_dismiss');
        document.querySelectorAll('[data-alert-dismiss]').forEach((btn) => {
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        });
    }

    function setAlertBanner(message) {
        const banners = document.querySelectorAll('[data-alert-banner]');
        banners.forEach((banner) => {
            const msgEl = banner.querySelector('[data-alert-message]');
            if (!message) {
                if (msgEl) msgEl.textContent = '';
                banner.style.display = 'none';
            } else {
                if (msgEl) msgEl.textContent = message;
                banner.style.display = 'flex';
            }
        });
    }

    function buildAlertMessage(info) {
        const title = getLocalizedValue(info.title || info.message);
        const description = getLocalizedValue(info.description);
        const vars = { desc: description || '' };
        const titleText = formatTemplate(title, vars).trim();
        const descText = formatTemplate(description, vars).trim();
        return [titleText, descText].filter(Boolean).join('\n').trim();
    }

    function shouldShowAlert(info) {
        if (!info || !info.aid) return false;
        if (dismissedAlertAid && info.aid === dismissedAlertAid) return false;
        const expires = Number(info.expired);
        if (!Number.isFinite(expires)) return false;
        const nowSec = Math.floor(Date.now() / 1000);
        if (expires <= nowSec) return false;
        const message = buildAlertMessage(info);
        return !!message;
    }

    function renderAlertBanner() {
        updateAlertDismissLabels();
        if (!shouldShowAlert(alertInfo)) {
            setAlertBanner('');
            return;
        }
        setAlertBanner(buildAlertMessage(alertInfo));
    }

    function dismissAlert() {
        if (alertInfo?.aid) {
            dismissedAlertAid = alertInfo.aid;
            localStorage.setItem(ALERT_DISMISS_KEY, dismissedAlertAid);
        }
        setAlertBanner('');
    }

    async function checkAlert(status) {
        const effectiveStatus = status || await checkOnlineStatus();
        if (effectiveStatus !== STATUS_ONLINE) return;
        const now = Date.now();
        if (alertCheckInFlight) return alertCheckInFlight;
        if (now - lastAlertCheck < ALERT_CHECK_INTERVAL) return;
        alertCheckInFlight = (async () => {
            const res = await fetch(`./alert.json?ts=${now}`, { cache: 'no-store' });
            if (!res.ok) {
                if (res.status === 404) {
                    alertInfo = null;
                    cacheAlertInfo(null);
                    renderAlertBanner();
                }
                return;
            }
            const info = await res.json();
            if (info && info.aid) {
                alertInfo = info;
                cacheAlertInfo(info);
            } else {
                alertInfo = null;
                cacheAlertInfo(null);
            }
            renderAlertBanner();
        })()
            .catch((e) => console.error(e))
            .finally(() => {
                lastAlertCheck = Date.now();
                alertCheckInFlight = null;
            });
        return alertCheckInFlight;
    }

    async function checkForUpdate(status) {
        try {
            const effectiveStatus = status || await checkOnlineStatus();
            if (effectiveStatus !== STATUS_ONLINE) return;
            const now = Date.now();
            if (updateCheckInFlight) return updateCheckInFlight;
            if (now - lastUpdateCheck < UPDATE_CHECK_INTERVAL) return;
            updateCheckInFlight = (async () => {
                const res = await fetch(`./version.json?ts=${now}`, { cache: 'no-store' });
                if (!res.ok) {
                    if (res.status === 404) {
                        latestVersionInfo = null;
                        cacheVersionInfo(null);
                        updateAvailable = false;
                        renderUpdateBanner();
                    }
                    return;
                }
                const info = await res.json();
                if (!info || !info.version) return;
                latestVersionInfo = info;
                cacheVersionInfo(info);
                const storedVersion = localStorage.getItem('mixer_installed_version');
                const storedVid = localStorage.getItem('mixer_installed_vid') || localStorage.getItem('mixer_installed_uuid');
                if (!storedVersion) {
                    installedVersion = info.version;
                    installedVid = info.vid || '';
                    localStorage.setItem('mixer_installed_version', installedVersion);
                    if (installedVid) localStorage.setItem('mixer_installed_vid', installedVid);
                    updateAvailable = false;
                    updateVersionDisplay();
                    setUpdateBanner('');
                    return;
                }
                installedVersion = storedVersion;
                installedVid = storedVid || '';
                const versionChanged = compareVersions(info.version, installedVersion) > 0;
                const vidChanged = !!(info.vid && installedVid && info.vid !== installedVid);
                updateAvailable = versionChanged || vidChanged;
                if (!updateAvailable && info.vid && info.vid !== installedVid) {
                    installedVid = info.vid;
                    localStorage.setItem('mixer_installed_vid', installedVid);
                }
                renderUpdateBanner();
                updateVersionDisplay();
            })()
                .catch((e) => console.error(e))
                .finally(() => {
                    lastUpdateCheck = Date.now();
                    updateCheckInFlight = null;
                });
            return updateCheckInFlight;
        } catch (e) {
            console.error(e);
        }
    }

    function probeExternal(url, ts) {
        const sep = url.includes('?') ? '&' : '?';
        return fetch(`${url}${sep}ts=${ts}`, { mode: 'no-cors', cache: 'no-store' })
            .then(() => true)
            .catch(() => false);
    }

    async function checkOnlineStatus() {
        if (navigator.onLine === false) {
            lastKnownStatus = STATUS_OFFLINE;
            return lastKnownStatus;
        }
        const now = Date.now();
        if (statusCheckInFlight) return statusCheckInFlight;
        if (now - lastStatusCheck < STATUS_CHECK_INTERVAL) return lastKnownStatus;
        statusCheckInFlight = (async () => {
            const [primaryOk, nationalOk] = await Promise.all([
                probeExternal(PRIMARY_CHECK_URL, now),
                probeExternal(NATIONAL_CHECK_URL, now)
            ]);
            if (primaryOk) return STATUS_ONLINE;
            if (nationalOk) return STATUS_NATIONAL;
            return STATUS_OFFLINE;
        })()
            .catch(() => STATUS_OFFLINE)
            .finally(() => {
                lastStatusCheck = Date.now();
                statusCheckInFlight = null;
            });
        lastKnownStatus = await statusCheckInFlight;
        return lastKnownStatus;
    }

    async function updateConnectionStatus() {
        const badge = document.getElementById('connection-status');
        if (!badge) return;
        const status = await checkOnlineStatus();
        const onlineText = t('status_online');
        const offlineText = t('status_offline');
        const nationalText = t('status_national');
        const isOnline = status === STATUS_ONLINE;
        const isNational = status === STATUS_NATIONAL;
        badge.textContent = isOnline ? onlineText : (isNational ? nationalText : offlineText);
        badge.classList.toggle('online', isOnline);
        badge.classList.toggle('offline', status === STATUS_OFFLINE);
        badge.classList.toggle('national', isNational);
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.disabled = !isOnline;
            refreshBtn.setAttribute('aria-disabled', String(!isOnline));
        }
        if (isOnline) checkForUpdate(status);
        checkAlert(status);
    }

    function renderFaq(translations) {
        const list = document.getElementById('faq-list');
        if (!list || !translations) return;
        list.innerHTML = '';

        const items = [];
        Object.keys(translations).forEach((key) => {
            const match = /^faq_q(\d+)$/.exec(key);
            if (!match) return;
            const idx = Number(match[1]);
            const question = translations[key];
            const answer = translations[`faq_a${idx}`];
            if (!question || !answer) return;
            items.push({ idx, question, answer });
        });

        items.sort((a, b) => a.idx - b.idx);
        items.forEach(({ question, answer }) => {
            const item = document.createElement('details');
            item.className = 'faq-item';
            const summary = document.createElement('summary');
            summary.textContent = question;
            const body = document.createElement('div');
            body.textContent = answer;
            item.appendChild(summary);
            item.appendChild(body);
            list.appendChild(item);
        });
    }

    function startConnectionWatcher() {
        if (connectionWatchTimer) return;
        updateConnectionStatus();
        connectionWatchTimer = setInterval(updateConnectionStatus, 2000);
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        window.addEventListener('focus', updateConnectionStatus);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) updateConnectionStatus();
        });
        const netInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (netInfo?.addEventListener) {
            netInfo.addEventListener('change', updateConnectionStatus);
        }
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js')
            .catch((err) => console.error('Service worker registration failed', err));
    }

    function applyLanguage(lang) {
        const translations = lang === 'fa' ? window.langFa : window.langEn;
        if (!translations) return;
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) el.textContent = translations[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) el.placeholder = translations[key];
        });

        const chunkingToggle = document.getElementById('chunking-toggle');
        if (chunkingToggle) updateChunkToggleText(chunkingToggle, chunkingEnabled);
        renderFaq(translations);
        updateVersionDisplay();
        updateConnectionStatus();
        renderUpdateBanner();
        renderAlertBanner();
    }

    function changeLanguage(lang) {
        localStorage.setItem('mixer_lang', lang);
        applyLanguage(lang);
    }

    function changePattern(patternId) {
        const nextPattern = resolvePatternId(patternId);
        if (nextPattern === currentPattern) return;
        currentPattern = nextPattern;
        localStorage.setItem('mixer_pattern', currentPattern);
        const selector = document.getElementById('pattern-selector');
        if (selector && selector.value !== currentPattern) selector.value = currentPattern;
        doEncode();
    }

    function applyTheme(theme) {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.toggle('light-mode', !prefersDark);
        } else {
            body.classList.remove('light-mode');
        }
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', body.classList.contains('light-mode') ? '#f2f2f7' : '#0a0a0a');
        }
    }

    function changeTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('mixer_theme', theme);
        applyTheme(theme);
    }

    async function smartPaste(targetId, callback) {
        const el = document.getElementById(targetId);
        if (!el) return;
        el.focus();
        if (navigator.clipboard?.readText) {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    el.value = text;
                    if (typeof callback === 'function') callback();
                    showToast(t('toast_pasted'));
                    return;
                }
                showToast(t('toast_clipboard_empty'));
            } catch {
                showToast(t('toast_paste_manual'));
            }
        } else {
            showToast(t('toast_paste_manual'));
        }
    }

    function copyText(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const raw = el.dataset.raw || '';
        const value = raw || el.value || '';
        if (!value) return;
        const msg = t('toast_copied');
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(value).then(() => showToast(msg)).catch(() => {
                if (raw) {
                    fallbackCopyTextValue(value);
                } else {
                    fallbackCopy(el, msg);
                }
            });
        } else {
            if (raw) {
                fallbackCopyTextValue(value);
            } else {
                fallbackCopy(el, msg);
            }
        }
    }

    function fallbackCopy(el, msg) {
        el.select();
        el.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch (err) {
            console.error(err);
        }
        window.getSelection().removeAllRanges();
        el.blur();
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function setupInteractionGuards() {
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        document.addEventListener('copy', (event) => {
            event.preventDefault();
        });

        document.addEventListener('cut', (event) => {
            event.preventDefault();
        });

        document.addEventListener('keydown', (event) => {
            if (!(event.ctrlKey || event.metaKey)) return;
            const key = String(event.key || '').toLowerCase();
            if (key === 'c' || key === 'x') {
                event.preventDefault();
            }
        });

        document.addEventListener('selectstart', (event) => {
            event.preventDefault();
        });

        document.addEventListener('dragstart', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (!target.closest('input, textarea')) {
                event.preventDefault();
            }
        });

    }

    function switchTab(event, tabId) {
        enforceLock();
        document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
        const target = document.getElementById(`page-${tabId}`);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
        if (event?.currentTarget) event.currentTarget.classList.add('active');
    }

    function init() {
        const langSelector = document.getElementById('lang-selector');
        const themeSelector = document.getElementById('theme-selector');
        const patternSelector = document.getElementById('pattern-selector');
        const passwordInput = document.getElementById('password-value');
        const chunkingToggle = document.getElementById('chunking-toggle');
        const outputSend = document.getElementById('output-send');
        const pinInput = document.getElementById('pin-value');
        document.querySelectorAll('[data-alert-dismiss]').forEach((btn) => {
            btn.onclick = dismissAlert;
        });

        if (langSelector) langSelector.value = currentLang;
        if (themeSelector) themeSelector.value = currentTheme;
        currentPattern = resolvePatternId(currentPattern);
        if (patternSelector) {
            patternSelector.value = currentPattern;
            patternSelector.addEventListener('change', (event) => {
                const target = event.target;
                const value = target && target.value ? target.value : patternSelector.value;
                changePattern(value);
            });
        }
        if (passwordInput) passwordInput.value = currentPassword;
        if (chunkingToggle) {
            updateChunkToggleText(chunkingToggle, chunkingEnabled);
        }
        if (outputSend) {
            outputSend.addEventListener('copy', (event) => {
                const raw = outputSend.dataset.raw;
                if (!raw || !event.clipboardData) return;
                event.preventDefault();
                event.clipboardData.setData('text/plain', raw);
                showToast(t('toast_copied'));
            });
        }
        if (pinInput) {
            pinInput.addEventListener('blur', () => {
                const normalized = toEnglishDigits(pinInput.value || '');
                const inputVal = normalized.replace(/\D/g, '');
                if (inputVal.length > 0 && inputVal.length < 4) {
                    showToast(t('toast_pin_short'));
                }
            });
        }

        loadCachedVersionInfo();
        loadCachedAlertInfo();
        applyLanguage(currentLang);
        applyTheme(currentTheme);
        startConnectionWatcher();
        registerServiceWorker();
        updatePasswordWarning();
        checkForUpdate();
        checkAlert();
        const initialOut = document.getElementById('output-send')?.value || '';
        updateCharCounter(initialOut.length);
        renderChunks(initialOut);
        try { enforceLock(); } catch (e) { console.error(e); lockSatisfied = true; hideLockOverlay(); }
        setupInteractionGuards();

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (currentTheme === 'system') applyTheme('system');
            });
        }
    }

    async function hashPin(pin) {
        const data = enc.encode(pin);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = new Uint8Array(digest);
        return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    function loadStoredPin() {
        const length = Number(localStorage.getItem('mixer_pin_len')) || 0;
        const v0 = localStorage.getItem('mixer_pin_v0');
        if (!hasWebCrypto && v0 && v0.startsWith('v0:')) {
            try {
                const bytes = base64UrlToBytes(v0.slice(3));
                if (bytes.length >= 12) {
                    const salt = bytes.slice(0, 8);
                    const hash = ((bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11]) >>> 0;
                    return { version: 0, salt, hash, length };
                }
            } catch (e) { /* ignore parse errors */ }
        }
        const v2 = localStorage.getItem('mixer_pin_v2');
        if (v2 && v2.startsWith('v2:')) {
            try {
                const bytes = base64UrlToBytes(v2.slice(3));
                const salt = bytes.slice(0, 16);
                const hash = bytes.slice(16);
                return { version: 2, salt, hash, length };
            } catch (e) { /* ignore parse errors */ }
        }
        if (v0 && v0.startsWith('v0:')) {
            try {
                const bytes = base64UrlToBytes(v0.slice(3));
                if (bytes.length >= 12) {
                    const salt = bytes.slice(0, 8);
                    const hash = ((bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11]) >>> 0;
                    return { version: 0, salt, hash, length };
                }
            } catch (e) { /* ignore parse errors */ }
        }
        const legacy = localStorage.getItem('mixer_pin_hash');
        if (legacy) return { version: 1, legacyHash: legacy, length };
        return null;
    }

    async function derivePinHash(pin, salt) {
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, keyMaterial, 256);
        return new Uint8Array(bits);
    }

    async function derivePinKey(pin, salt) {
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptSecretWithPin(pin, secret) {
        const salt = randomBytes(16);
        const iv = randomBytes(12);
        const key = await derivePinKey(pin, salt);
        const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(secret));
        const cipher = new Uint8Array(cipherBuf);
        const payload = new Uint8Array(salt.length + iv.length + cipher.length);
        payload.set(salt);
        payload.set(iv, salt.length);
        payload.set(cipher, salt.length + iv.length);
        return bytesToBase64Url(payload);
    }

    async function decryptSecretWithPin(pin, payloadB64) {
        const bytes = base64UrlToBytes(payloadB64);
        const salt = bytes.slice(0, 16);
        const iv = bytes.slice(16, 28);
        const cipher = bytes.slice(28);
        const key = await derivePinKey(pin, salt);
        const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
        return dec.decode(plainBuf);
    }

    function constTimeEqual(a, b) {
        if (a.length !== b.length) return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++) diff |= (a[i] ^ b[i]);
        return diff === 0;
    }

    function storeWeakPin(inputVal) {
        const salt = randomBytes(8);
        const hash = weakHashPin(inputVal, salt);
        const payload = new Uint8Array(salt.length + 4);
        payload.set(salt);
        payload[salt.length] = (hash >>> 24) & 0xff;
        payload[salt.length + 1] = (hash >>> 16) & 0xff;
        payload[salt.length + 2] = (hash >>> 8) & 0xff;
        payload[salt.length + 3] = hash & 0xff;
        const encoded = 'v0:' + bytesToBase64Url(payload);
        localStorage.setItem('mixer_pin_v0', encoded);
        localStorage.removeItem('mixer_pin_v2');
        localStorage.removeItem('mixer_pin_hash');
        localStorage.removeItem('mixer_password_enc');
        localStorage.setItem('mixer_pin_len', String(inputVal.length));
        pinRecord = { version: 0, salt, hash, length: inputVal.length };
        lockSatisfied = true;
        hideLockOverlay();
        lastEnteredPin = inputVal;
        if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
        showToast(t('toast_lock_enabled'));
    }

    async function updatePinFromSettings(val) {
        const normalized = toEnglishDigits(val || '');
        const inputVal = normalized.replace(/\D/g, '');
        const inputEl = document.getElementById('pin-value');
        if (inputEl) {
            if (inputEl.value !== inputVal) inputEl.value = inputVal;
        }

        if (!inputVal) {
            pinRecord = null;
            lockSatisfied = true;
            lastEnteredPin = '';
            localStorage.removeItem('mixer_pin_v0');
            localStorage.removeItem('mixer_pin_v2');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_pin_len');
            if (currentPassword) localStorage.setItem('mixer_password', currentPassword);
            else localStorage.removeItem('mixer_password');
            hideLockOverlay();
            showToast(t('toast_pin_disabled'));
            return;
        }

        if (inputVal.length < 4) return;

        if (!hasWebCrypto) {
            storeWeakPin(inputVal);
            return;
        }

        try {
            const salt = randomBytes(16);
            const hash = await derivePinHash(inputVal, salt);
            const payload = new Uint8Array(salt.length + hash.length);
            payload.set(salt);
            payload.set(hash, salt.length);
            const encoded = 'v2:' + bytesToBase64Url(payload);
            localStorage.setItem('mixer_pin_v2', encoded);
            localStorage.removeItem('mixer_pin_v0');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_password');
            localStorage.setItem('mixer_pin_len', String(inputVal.length));
            pinRecord = { version: 2, salt, hash, length: inputVal.length };
            lockSatisfied = true;
            hideLockOverlay();
            lastEnteredPin = inputVal;
            if (currentPassword) {
                try {
                    const encPwd = await encryptSecretWithPin(inputVal, currentPassword);
                    localStorage.setItem('mixer_password_enc', encPwd);
                } catch (e) { /* ignore */ }
            }
            showToast(t('toast_lock_enabled'));
        } catch (e) {
            console.error(e);
            storeWeakPin(inputVal);
        }
    }

    function showLockOverlay() {
        const overlay = document.getElementById('lock-overlay');
        if (overlay) {
            overlay.classList.remove('fade-out');
            overlay.classList.remove('error-flash');
            overlay.style.display = 'flex';
        }
        renderKeypad();
    }

    function hideLockOverlay() {
        const overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
            overlay.classList.remove('fade-out');
        }, 250);
    }

    async function unlockApp() {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        if (unlockInProgress) return;
        unlockInProgress = true;
        const pin = toEnglishDigits((input.value || '').trim());
        try {
            if (!pinRecord) {
                lockSatisfied = true;
                hideLockOverlay();
                input.value = '';
                return;
            }
            let ok = false;
            if (!hasWebCrypto && pinRecord.version !== 0) {
                showToast(t('toast_lock_unavailable'));
                pinRecord = null;
                lockSatisfied = true;
                hideLockOverlay();
                input.value = '';
                return;
            }
            if (pinRecord.version === 0) {
                const calc = weakHashPin(pin, pinRecord.salt);
                ok = calc === pinRecord.hash;
            } else if (pinRecord.version === 2) {
                const calc = await derivePinHash(pin, pinRecord.salt);
                ok = constTimeEqual(calc, pinRecord.hash);
            } else if (pinRecord.version === 1) {
                const legacy = await hashPin(pin);
                ok = legacy === pinRecord.legacyHash;
            }

            if (ok) {
                lockSatisfied = true;
                failedPinAttempts = 0;
                hideLockOverlay();
                input.value = '';
                lastEnteredPin = pin;
                const settingsInput = document.getElementById('pin-value');
                if (settingsInput) settingsInput.value = pin;
                try {
                    const storedEnc = localStorage.getItem('mixer_password_enc');
                    const pwdInput = document.getElementById('password-value');
                    if (storedEnc) {
                        const restored = await decryptSecretWithPin(pin, storedEnc);
                        currentPassword = restored;
                        if (pwdInput) pwdInput.value = restored;
                    } else {
                        const plain = localStorage.getItem('mixer_password') || '';
                        currentPassword = plain;
                        if (pwdInput) pwdInput.value = plain;
                    }
                } catch (e) { console.error(e); }
                localStorage.setItem('mixer_pin_len', String(pin.length));
                if (pinRecord) pinRecord.length = pin.length;
                updatePasswordWarning();
                doEncode();
                showToast(t('toast_welcome'));
            } else {
                failedPinAttempts += 1;
                if (failedPinAttempts >= 3) {
                    showToast(t('toast_panic_fail'));
                    panicClear();
                    return;
                }
                showToast(t('toast_pin_wrong', { count: failedPinAttempts, max: 3 }));
                flashLockError();
                deletePinDigit();
            }
        } finally {
            unlockInProgress = false;
        }
    }

    function enforceLock() {
        if (!pinRecord) {
            hideLockOverlay();
            lockSatisfied = true;
            return;
        }
        if (!hasWebCrypto && pinRecord && pinRecord.version !== 0) {
            showToast(t('toast_lock_unavailable'));
            pinRecord = null;
            lockSatisfied = true;
            hideLockOverlay();
            return;
        }
        if (!lockSatisfied) showLockOverlay();
        else hideLockOverlay();
    }

    function pressPinDigit(d) {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        const targetLen = pinRecord?.length || 4;
        if (input.value.length >= targetLen) return;
        input.value += d;
    }

    function deletePinDigit() {
        const input = document.getElementById('unlock-pin');
        if (!input) return;
        input.value = input.value.slice(0, -1);
    }

    function panicClear(event) {
        event?.preventDefault?.();
        const fields = ['input-send', 'output-send', 'input-receive', 'output-receive', 'unlock-pin', 'pin-value', 'password-value'];
        fields.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        pinRecord = null;
        lockSatisfied = true;
        lastEnteredPin = '';
        failedPinAttempts = 0;
        try {
            localStorage.clear();
        } catch (e) {
            localStorage.removeItem('mixer_pin_v2');
            localStorage.removeItem('mixer_pin_hash');
            localStorage.removeItem('mixer_password_enc');
            localStorage.removeItem('mixer_password');
            localStorage.removeItem('mixer_lang');
            localStorage.removeItem('mixer_theme');
            localStorage.removeItem('mixer_pattern');
        }
        currentPassword = '';
        updatePasswordWarning();
        updateCharCounter(0);
        doEncode();
        hideLockOverlay();
        resetPanicOverlay();
        showToast(t('toast_cleared'));
    }

    function flashLockError() {
        const overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        overlay.classList.remove('error-flash');
        void overlay.offsetWidth; // force reflow
        overlay.classList.add('error-flash');
    }

    function startPanicHold(event) {
        event?.preventDefault?.();
        endPanicHold();
        panicRemaining = 3;
        showHoldToast(panicRemaining);
        panicHoldInterval = setInterval(() => {
            panicRemaining -= 1;
            if (panicRemaining <= 0) {
                endPanicHold(true);
                panicClear();
            } else {
                showHoldToast(panicRemaining);
            }
        }, 1000);
        panicHoldTimer = setTimeout(() => {}, 0); // marker
    }

    function endPanicHold(triggered) {
        if (panicHoldInterval) {
            clearInterval(panicHoldInterval);
            panicHoldInterval = null;
        }
        if (panicHoldTimer) {
            clearTimeout(panicHoldTimer);
            panicHoldTimer = null;
        }
        if (!triggered && panicRemaining === 3) {
            showToast(t('toast_panic_hold_hint'));
        } else if (!triggered) {
            hideToast();
        }
        if (!triggered) {
            resetPanicOverlay();
        }
    }

    function showHoldToast(seconds) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const displaySec = formatCountdownSeconds(seconds);
        toast.textContent = t('toast_panic_hold', { sec: displaySec });
        toast.classList.add('show');
        pulsePanicOverlay();
    }

    function hideToast() {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.classList.remove('show');
    }

    function pulsePanicOverlay() {
        const overlay = document.getElementById('panic-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.classList.remove('beat');
        void overlay.offsetWidth;
        overlay.classList.add('beat');
    }

    function resetPanicOverlay() {
        const overlay = document.getElementById('panic-overlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.classList.remove('beat');
    }

    function pulseRefreshOverlay() {
        const overlay = document.getElementById('refresh-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        overlay.classList.remove('beat');
        void overlay.offsetWidth;
        overlay.classList.add('beat');
    }

    function resetRefreshOverlay() {
        const overlay = document.getElementById('refresh-overlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        overlay.classList.remove('beat');
    }

    function showRefreshHoldToast(seconds) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const template = t('refresh_hold');
        const displaySec = formatCountdownSeconds(seconds);
        toast.textContent = template.replace('{sec}', displaySec);
        toast.classList.add('show');
        pulseRefreshOverlay();
    }

    function startRefreshHold(event) {
        event?.preventDefault?.();
        endRefreshHold();
        if (refreshInProgress) return;
        refreshRemaining = 3;
        showRefreshHoldToast(refreshRemaining);
        refreshHoldInterval = setInterval(() => {
            refreshRemaining -= 1;
            if (refreshRemaining <= 0) {
                endRefreshHold(true);
                refreshApp();
            } else {
                showRefreshHoldToast(refreshRemaining);
            }
        }, 1000);
        refreshHoldTimer = setTimeout(() => {}, 0); // marker
    }

    function endRefreshHold(triggered) {
        if (refreshHoldInterval) {
            clearInterval(refreshHoldInterval);
            refreshHoldInterval = null;
        }
        if (refreshHoldTimer) {
            clearTimeout(refreshHoldTimer);
            refreshHoldTimer = null;
        }
        if (!triggered && refreshRemaining === 3) {
            showToast(t('refresh_hold_hint'));
        } else if (!triggered) {
            hideToast();
        }
        if (!triggered) {
            resetRefreshOverlay();
        }
    }

    async function clearAppStorage() {
        try { localStorage.clear(); } catch (e) {}
        try { sessionStorage.clear(); } catch (e) {}
        if (navigator.serviceWorker?.getRegistrations) {
            try {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map((reg) => reg.unregister()));
            } catch (e) {}
        }
        if (window.caches?.keys) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            } catch (e) {}
        }
        if (window.indexedDB?.databases) {
            try {
                const dbs = await indexedDB.databases();
                await Promise.all(dbs.map((db) => {
                    if (!db?.name) return Promise.resolve();
                    return new Promise((resolve) => {
                        const req = indexedDB.deleteDatabase(db.name);
                        req.onsuccess = () => resolve();
                        req.onerror = () => resolve();
                        req.onblocked = () => resolve();
                    });
                }));
            } catch (e) {}
        }
    }

    function forceReload() {
        const url = new URL(window.location.href);
        url.searchParams.set('refresh', Date.now().toString());
        window.location.replace(url.toString());
    }

    async function refreshApp() {
        if (refreshInProgress) return;
        const status = await checkOnlineStatus();
        if (status !== STATUS_ONLINE) {
            showToast(t('refresh_no_net'));
            resetRefreshOverlay();
            return;
        }
        refreshInProgress = true;
        pulseRefreshOverlay();
        setTimeout(resetRefreshOverlay, 800);
        const msg = t('refreshing');
        showToast(msg);
        try {
            await clearAppStorage();
        } catch (e) {
            console.error(e);
        }
        forceReload();
    }

    function changeChunking(mode) {
        chunkingEnabled = mode !== 'off';
        localStorage.setItem('mixer_chunking', chunkingEnabled ? 'on' : 'off');
        const stripZwc = resolvePatternId(currentPattern) === 'zwc';
        renderChunks(lastEncodedOutput, stripZwc);
    }

    function toggleChunking() {
        chunkingEnabled = !chunkingEnabled;
        localStorage.setItem('mixer_chunking', chunkingEnabled ? 'on' : 'off');
        const btn = document.getElementById('chunking-toggle');
        if (btn) updateChunkToggleText(btn, chunkingEnabled);
        const stripZwc = resolvePatternId(currentPattern) === 'zwc';
        renderChunks(lastEncodedOutput, stripZwc);
    }

    function updateChunkToggleText(btn, enabled) {
        const textOn = t('chunk_on');
        const textOff = t('chunk_off');
        btn.textContent = enabled ? textOn : textOff;
        btn.classList.toggle('active', enabled);
    }

    async function copyChunk(idx) {
        const chunk = currentChunks[idx];
        if (!chunk) return;
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(chunk);
                showToast(t('toast_copied'));
                return;
            } catch (e) {}
        }
        fallbackCopyTextValue(chunk);
    }

    async function copyAllChunks() {
        if (!currentChunks.length) return;
        const text = currentChunks.join('\n');
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                showToast(t('toast_copied'));
                return;
            } catch (e) {}
        }
        fallbackCopyTextValue(text);
    }

    function fallbackCopyTextValue(text) {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        tmp.setSelectionRange(0, 99999);
        try { document.execCommand('copy'); showToast(t('toast_copied')); } catch (err) {}
        document.body.removeChild(tmp);
    }

    function renderKeypad() {
        const container = document.getElementById('pin-keypad');
        if (!container) return;
        const digits = Array.from({ length: 10 }, (_, i) => String(i));
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        const slots = [
            digits[0], digits[1], digits[2],
            digits[3], digits[4], digits[5],
            digits[6], digits[7], digits[8],
            'del',   digits[9], 'unlock'
        ];

        container.innerHTML = '';
        slots.forEach((item) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            if (item === 'del') {
                btn.textContent = '←';
                btn.onclick = deletePinDigit;
            } else if (item === 'unlock') {
                btn.classList.add('unlock-btn');
                btn.setAttribute('aria-label', t('lock_unlock_btn'));
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6h-1V9a5 5 0 0 0-10 0h2a3 3 0 0 1 6 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"/></svg>';
                btn.onclick = unlockApp;
            } else {
                btn.textContent = item;
                btn.onclick = () => pressPinDigit(item);
            }
            container.appendChild(btn);
        });
    }

    window.doEncode = doEncode;
    window.doDecode = doDecode;
    window.smartPaste = smartPaste;
    window.copyText = copyText;
    window.switchTab = switchTab;
    window.changeLanguage = changeLanguage;
    window.changePattern = changePattern;
    window.changeTheme = changeTheme;
    window.updatePassword = updatePassword;
    window.unlockApp = unlockApp;
    window.pressPinDigit = pressPinDigit;
    window.deletePinDigit = deletePinDigit;
    window.updatePinFromSettings = updatePinFromSettings;
    window.panicClear = panicClear;
    window.startPanicHold = startPanicHold;
    window.endPanicHold = endPanicHold;
    window.startRefreshHold = startRefreshHold;
    window.endRefreshHold = endRefreshHold;
    window.refreshApp = refreshApp;
    window.copyChunk = copyChunk;
    window.copyAllChunks = copyAllChunks;
    window.changeChunking = changeChunking;
    window.toggleChunking = toggleChunking;

    window.addEventListener('DOMContentLoaded', init);
})();
