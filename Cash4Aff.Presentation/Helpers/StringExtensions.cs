using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using static Cash4Aff.Presentation.Helpers.StringExtensions;

namespace Cash4Aff.Presentation.Helpers
{
    public static class StringExtensions
    {
        /// <summary>
        /// Insert spaces before capital letter in the string. I.e. "HelloWorld" turns into "Hello World"
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToSeparatedWords(this string value)
        {
            if (value != null)
            {
                return Regex.Replace(value, "([A-Z][a-z]?)", " $1").Trim();
            }
            return null;
        }
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public enum EncodingType
        {
            Base64 = 1,
            Base64Url = 2,
            Base32Url = 3,
            ZBase32 = 4,
            Base32LowProfanity = 5,
            Base32Crockford = 6,
        }

        private const string Alphabet = "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_";
        private static readonly int Base = Alphabet.Length;
        public static string Encode(int num)
        {
            var sb = new StringBuilder();
            while (num > 0)
            {
                sb.Insert(0, Alphabet.ElementAt(num % Base));
                num = num / Base;
            }
            return sb.ToString();
        }

        public static int Decode(string str)
        {
            var num = 0;
            for (var i = 0; i < str.Length; i++)
            {
                num = num * Base + Alphabet.IndexOf(str.ElementAt(i));
            }
            return num;
        }
    }

    /// <summary>
    /// Base3264Encoding is a standard base 32/64 encoder/decoder
    /// 
    /// The base 32 conversions are based on the standards except that padding is turned
    /// off and it is not case sensitive (by default).
    /// 
    /// ZBase32, Crockford and a low profanity base 32 alphabets are included to support
    /// various use cases.
    /// 
    /// Note that the crockford base32 encoding doesn't support the crockford checksum
    /// mechanism.
    /// 
    /// RFC: http://tools.ietf.org/html/rfc4648
    /// Base32: http://en.wikipedia.org/wiki/Base32
    /// Base64: http://en.wikipedia.org/wiki/Base64
    /// Crockford: http://www.crockford.com/wrmg/base32.html
    /// </summary>
    public static class Base3264Encoding
    {
        /// <summary>
        /// Encodes bytes (such as binary url tokens) into a string.
        /// </summary>
        /// <param name="type">Encoding type.</param>
        /// <param name="input">byte[] to be encoded</param>
        /// <returns>encoded string</returns>
        /// <exception cref="ArgumentException">If encoding type is None, UriData, UriPathData or Uri</exception>
        public static string Encode(EncodingType type, byte[] input)
        {
            switch (type)
            {
                case EncodingType.Base64:
                    return Convert.ToBase64String(input, Base64FormattingOptions.None);
                case EncodingType.Base64Url:
                    return Base64Url.ToBase64ForUrlString(input);
                case EncodingType.Base32Url:
                    return Base32Url.ToBase32String(input);
                case EncodingType.ZBase32:
                    return new Base32Url(false, false, true, Base32Url.ZBase32Alphabet).Encode(input);
                case EncodingType.Base32LowProfanity:
                    return new Base32Url(false, true, true, Base32Url.Base32LowProfanityAlphabet).Encode(input);
                case EncodingType.Base32Crockford:
                    return new Base32Url(false, true, true, Base32Url.Base32CrockfordHumanFriendlyAlphabet).Encode(input);
                default:
                    throw new NotImplementedException("Encoding type not implemented: " + type);
            }
        }

        /// <summary>
        /// Decodes an encoded string to the original binary.
        /// </summary>
        /// <param name="type">Encoding type</param>
        /// <param name="input">Encoded string</param>
        /// <returns>Original byte[]</returns>
        /// <exception cref="ArgumentException">If encoding type is None, UriData, UriPathData or Uri</exception>
        public static byte[] Decode(EncodingType type, string input)
        {
            switch (type)
            {
                case EncodingType.Base64:
                    return Convert.FromBase64String(input);
                case EncodingType.Base64Url:
                    return Base64Url.FromBase64ForUrlString(input);
                case EncodingType.Base32Url:
                    return Base32Url.FromBase32String(input);
                case EncodingType.ZBase32:
                    return new Base32Url(false, false, true, Base32Url.ZBase32Alphabet).Decode(input);
                case EncodingType.Base32LowProfanity:
                    return new Base32Url(false, true, true, Base32Url.Base32LowProfanityAlphabet).Decode(input);
                case EncodingType.Base32Crockford:
                    return new Base32Url(false, true, true, Base32Url.Base32CrockfordHumanFriendlyAlphabet).Decode(input);
                default:
                    throw new NotImplementedException("Encoding type not implemented: " + type);
            }
        }

        /// <summary>
        /// Encodes a string to specified format encoding (base 32/64/etc), strings are first converted to a bom-free utf8 byte[] then to relevant encoding.
        /// </summary>
        /// <param name="type">encoding type</param>
        /// <param name="input">string to be encoded</param>
        /// <returns>Encoded string</returns>
        public static string EncodeString(EncodingType type, string input)
        {
            var enc = new UTF8Encoding(false, true);

            switch (type)
            {
                case EncodingType.Base64:
                    return Convert.ToBase64String(enc.GetBytes(input), Base64FormattingOptions.None);
                case EncodingType.Base64Url:
                    return Base64Url.ToBase64ForUrlString(enc.GetBytes(input));
                case EncodingType.Base32Url:
                    return Base32Url.ToBase32String(enc.GetBytes(input));
                case EncodingType.ZBase32:
                    return new Base32Url(false, false, true, Base32Url.ZBase32Alphabet).Encode(enc.GetBytes(input));
                case EncodingType.Base32LowProfanity:
                    return new Base32Url(false, true, true, Base32Url.Base32LowProfanityAlphabet).Encode(enc.GetBytes(input));
                case EncodingType.Base32Crockford:
                    return new Base32Url(false, true, true, Base32Url.Base32CrockfordHumanFriendlyAlphabet).Encode(enc.GetBytes(input));
                default:
                    throw new NotImplementedException("Encoding type not implemented: " + type);
            }
        }

        /// <summary>
        /// Decodes an encoded string to its original string value (before it was encoded with the EncodeString method)
        /// </summary>
        /// <param name="type">Decoding type</param>
        /// <param name="input">Encoded string</param>
        /// <returns>Original string value</returns>
        public static string DecodeToString(EncodingType type, string input)
        {
            var enc = new UTF8Encoding(false, true);

            switch (type)
            {
                case EncodingType.Base64:
                    return enc.GetString(Convert.FromBase64String(input));
                case EncodingType.Base64Url:
                    return enc.GetString(Base64Url.FromBase64ForUrlString(input));
                case EncodingType.Base32Url:
                    return enc.GetString(Base32Url.FromBase32String(input));
                case EncodingType.ZBase32:
                    return enc.GetString(new Base32Url(false, false, true, Base32Url.ZBase32Alphabet).Decode(input));
                case EncodingType.Base32LowProfanity:
                    return enc.GetString(new Base32Url(false, true, true, Base32Url.Base32LowProfanityAlphabet).Decode(input));
                case EncodingType.Base32Crockford:
                    return enc.GetString(new Base32Url(false, true, true, Base32Url.Base32CrockfordHumanFriendlyAlphabet).Decode(input));
                default:
                    throw new NotImplementedException("Encoding type not implemented: " + type);
            }
        }

        /// <summary>
        /// Binary to standard base 64 (not url/uri safe)
        /// </summary>
        public static string ToBase64(byte[] input)
        {
            return Encode(EncodingType.Base64, input);
        }

        /// <summary>
        /// String to standard base 64 (not url/uri safe) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string ToBase64(string input)
        {
            return EncodeString(EncodingType.Base64, input);
        }

        /// <summary>
        /// Binary to "base64-url" per rfc standard (url safe 63rd/64th characters and no padding)
        /// </summary>
        public static string ToBase64Url(byte[] input)
        {
            return Encode(EncodingType.Base64Url, input);
        }
        /// <summary>
        /// String to "base64-url" per rfc standard (url safe 63rd/64th characters and no padding) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string ToBase64Url(string input)
        {
            return EncodeString(EncodingType.Base64Url, input);
        }

        /// <summary>
        /// Binary to "base32 url" per rfc (standard base 32 without padding, no padding, case insensitive)
        /// </summary>
        public static string ToBase32Url(byte[] input)
        {
            return Encode(EncodingType.Base32Url, input);
        }

        /// <summary>
        /// String to "base32 url" per rfc (standard base 32 without padding, no padding, case insensitive) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string ToBase32Url(string input)
        {
            return EncodeString(EncodingType.Base32Url, input);
        }

        /// <summary>
        /// Binary to zbase32 (no padding, case insensitive)
        /// </summary>
        public static string ToZBase32(byte[] input)
        {
            return Encode(EncodingType.ZBase32, input);
        }

        /// <summary>
        /// String to zbase32 (no padding, case insensitive) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string ToZBase32(string input)
        {
            return EncodeString(EncodingType.ZBase32, input);
        }

        /// <summary>
        /// Binary to base32 encoding with alphabet designed to reduce accidental profanity in output (no padding, case SENSITIVE)
        /// </summary>
        public static string ToBase32LowProfanity(byte[] input)
        {
            return Encode(EncodingType.Base32LowProfanity, input);
        }

        /// <summary>
        /// String to base32 encoding with alphabet designed to reduce accidental profanity in output (no padding, case SENSITIVE) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string ToBase32LowProfanity(string input)
        {
            return EncodeString(EncodingType.Base32LowProfanity, input);
        }

        /// <summary>
        /// Binary to base32 encoding designed for human readability or OCR / hand writing recognition situations (non symmetric conversion - i.e. 1IiLl all mean the same thing). Case insensitive, no padding.
        /// </summary>
        public static string ToBase32Crockford(byte[] input)
        {
            return Encode(EncodingType.Base32Crockford, input);
        }

        /// <summary>
        /// String to base32 encoding designed for human readability or OCR / hand writing recognition situations (non symmetric conversion - i.e. 1IiLl all mean the same thing). Case insensitive, no padding.
        /// Uses bom-free utf8 for string to binary encoding.
        /// </summary>
        public static string ToBase32Crockford(string input)
        {
            return EncodeString(EncodingType.Base32Crockford, input);
        }

        /// <summary>
        /// To binary from standard base 64 (not url/uri safe)
        /// </summary>
        public static byte[] FromBase64(string input)
        {
            return Decode(EncodingType.Base64, input);
        }

        /// <summary>
        /// To string from base 64 (not url/uri safe) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string FromBase64ToString(string input)
        {
            return DecodeToString(EncodingType.Base64, input);
        }

        /// <summary>
        /// To binary from "base64-url" per rfc standard (url safe 63rd/64th characters and no padding)
        /// </summary>
        public static byte[] FromBase64Url(string input)
        {
            return Decode(EncodingType.Base64Url, input);
        }

        /// <summary>
        /// To string from "base64-url" per rfc standard (url safe 63rd/64th characters and no padding) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string FromBase64UrlToString(string input)
        {
            return DecodeToString(EncodingType.Base64Url, input);
        }

        /// <summary>
        /// To binary from "base32 url" per rfc (standard base 32 without padding, no padding, case insensitive)
        /// </summary>
        public static byte[] FromBase32Url(string input)
        {
            return Decode(EncodingType.Base32Url, input);
        }

        /// <summary>
        /// To string from "base32 url" per rfc (standard base 32 without padding, no padding, case insensitive) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string FromBase32UrlToString(string input)
        {
            return DecodeToString(EncodingType.Base32Url, input);
        }

        /// <summary>
        /// To binary from zbase32 (no padding, case insensitive) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static byte[] FromZBase32(string input)
        {
            return Decode(EncodingType.ZBase32, input);
        }

        /// <summary>
        /// to string from zbase32 (no padding, case insensitive) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string FromZBase32ToString(string input)
        {
            return DecodeToString(EncodingType.ZBase32, input);
        }

        /// <summary>
        /// To binary from base32 encoding with alphabet designed to reduce accidental profanity in output (no padding, case SENSITIVE)
        /// </summary>
        public static byte[] FromBase32LowProfanity(string input)
        {
            return Decode(EncodingType.Base32LowProfanity, input);
        }

        /// <summary>
        /// To string from base32 encoding with alphabet designed to reduce accidental profanity in output (no padding, case SENSITIVE) - uses bom-free utf8 for string to binary encoding
        /// </summary>
        public static string FromBase32LowProfanityToString(string input)
        {
            return DecodeToString(EncodingType.Base32LowProfanity, input);
        }

        /// <summary>
        /// To binary from base32 encoding designed for human readability or OCR / hand writing recognition situations (non symmetric conversion - i.e. 1IiLl all mean the same thing). Case insensitive, no padding.
        /// </summary>
        public static byte[] FromBase32Crockford(string input)
        {
            return Decode(EncodingType.Base32Crockford, input);
        }

        /// <summary>
        /// To string from base32 encoding designed for human readability or OCR / hand writing recognition situations (non symmetric conversion - i.e. 1IiLl all mean the same thing). Case insensitive, no padding.
        /// Uses bom-free utf8 for string to binary encoding.
        /// </summary>
        public static string FromBase32CrockfordToString(string input)
        {
            return DecodeToString(EncodingType.Base32Crockford, input);
        }
    }

    public class Base32Url
    {
        public const char StandardPaddingChar = '=';
        public const string Base32StandardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        public const string ZBase32Alphabet = "ybndrfg8ejkmcpqxot1uwisza345h769";
        public const string Base32LowProfanityAlphabet = "ybndrfg8NjkmGpq2HtPRYSszT3J5h769";

        public static readonly CharMap[] Base32CrockfordHumanFriendlyAlphabet =
        {
            new CharMap('0', "0Oo"), new CharMap('1', "1IiLl"), new CharMap('2', "2"), new CharMap('3', "3"), new CharMap('4', "4"),
            new CharMap('5', "5"), new CharMap('6', "6"), new CharMap('7', "7"), new CharMap('8', "8"), new CharMap('9', "9"), new CharMap('A', "Aa"),
            new CharMap('B', "Bb"), new CharMap('C', "Cc"), new CharMap('D', "Dd"), new CharMap('E', "Ee"), new CharMap('F', "Ff"), new CharMap('G', "Gg"),
            new CharMap('H', "Hh"), new CharMap('J', "Jj"), new CharMap('K', "Kk"), new CharMap('M', "Mm"), new CharMap('N', "Nn"), new CharMap('P', "Pp"),
            new CharMap('Q', "Qq"), new CharMap('R', "Rr"), new CharMap('S', "Ss"), new CharMap('T', "Tt"), new CharMap('V', "Vv"), new CharMap('W', "Ww"),
            new CharMap('X', "Xx"), new CharMap('Y', "Yy"), new CharMap('Z', "Zz"),
        };

        #region CharMap struct
        public struct CharMap
        {
            public CharMap(char encodeTo, IEnumerable<char> decodeFrom)
            {
                Encode = encodeTo.ToString(CultureInfo.InvariantCulture);

                if (decodeFrom == null)
                {
                    throw new ArgumentException("CharMap decodeFrom cannot be null, encodeTo was: " + Encode);
                }

                Decode = decodeFrom.Select(c => c.ToString(CultureInfo.InvariantCulture)).ToArray();

                if (Decode.Length == 0)
                {
                    throw new ArgumentException("CharMap decodeFrom cannot be empty, encodeTo was: " + Encode);
                }

                if (!Decode.Contains(Encode))
                {
                    throw new ArgumentException("CharMap decodeFrom must include encodeTo. encodeTo was: '" + Encode + "', decodeFrom was: '" + string.Join("", Decode) + "'");
                }
            }

            public readonly string Encode;
            public readonly string[] Decode;
        }
        #endregion CharMap struct

        public char PaddingChar;
        public bool UsePadding;
        public bool IsCaseSensitive;
        public bool IgnoreWhiteSpaceWhenDecoding;

        private readonly CharMap[] _alphabet;
        private Dictionary<string, uint> _index;

        // alphabets may be used with varying case sensitivity, thus index must not ignore case
        private static Dictionary<string, Dictionary<string, uint>> _indexes = new Dictionary<string, Dictionary<string, uint>>(2, StringComparer.InvariantCulture);

        /// <summary>
        /// Create case insensitive encoder/decoder using the standard base32 alphabet without padding.
        /// White space is not permitted when decoding (not ignored).
        /// </summary>
        public Base32Url() : this(false, false, false, Base32StandardAlphabet) { }

        /// <summary>
        /// Create case insensitive encoder/decoder using the standard base32 alphabet.
        /// White space is not permitted when decoding (not ignored).
        /// </summary>
        /// <param name="padding">Require/use padding characters?</param>
        public Base32Url(bool padding) : this(padding, false, false, Base32StandardAlphabet) { }

        /// <summary>
        /// Create encoder/decoder using the standard base32 alphabet.
        /// White space is not permitted when decoding (not ignored).
        /// </summary>
        /// <param name="padding">Require/use padding characters?</param>
        /// <param name="caseSensitive">Be case sensitive when decoding?</param>
        public Base32Url(bool padding, bool caseSensitive) : this(padding, caseSensitive, false, Base32StandardAlphabet) { }

        /// <summary>
        /// Create encoder/decoder using the standard base32 alphabet.
        /// </summary>
        /// <param name="padding">Require/use padding characters?</param>
        /// <param name="caseSensitive">Be case sensitive when decoding?</param>
        /// <param name="ignoreWhiteSpaceWhenDecoding">Ignore / allow white space when decoding?</param>
        public Base32Url(bool padding, bool caseSensitive, bool ignoreWhiteSpaceWhenDecoding) : this(padding, caseSensitive, ignoreWhiteSpaceWhenDecoding, Base32StandardAlphabet) { }

        /// <summary>
        /// Create case insensitive encoder/decoder with alternative alphabet and no padding.
        /// White space is not permitted when decoding (not ignored).
        /// </summary>
        /// <param name="alternateAlphabet">Alphabet to use (such as Base32Url.ZBase32Alphabet)</param>
        public Base32Url(string alternateAlphabet) : this(false, false, false, alternateAlphabet) { }

        /// <summary>
        /// Create the encoder/decoder specifying all options manually.
        /// </summary>
        /// <param name="padding">Require/use padding characters?</param>
        /// <param name="caseSensitive">Be case sensitive when decoding?</param>
        /// <param name="ignoreWhiteSpaceWhenDecoding">Ignore / allow white space when decoding?</param>
        /// <param name="alternateAlphabet">Alphabet to use (such as Base32Url.ZBase32Alphabet, Base32Url.Base32StandardAlphabet or your own custom 32 character alphabet string)</param>
        public Base32Url(bool padding, bool caseSensitive, bool ignoreWhiteSpaceWhenDecoding, string alternateAlphabet)
            : this(padding, caseSensitive, ignoreWhiteSpaceWhenDecoding, alternateAlphabet.Select(c => new CharMap(c, new[] { c })).ToArray())
        {
        }

        /// <summary>
        /// Create the encoder/decoder specifying all options manually.
        /// </summary>
        /// <param name="padding">Require/use padding characters?</param>
        /// <param name="caseSensitive">Be case sensitive when decoding?</param>
        /// <param name="ignoreWhiteSpaceWhenDecoding">Ignore / allow white space when decoding?</param>
        /// <param name="alphabet">
        ///     Alphabet to use (such as Base32Url.Base32CrockfordHumanFriendlyAlphabet) that decodes multiple characters with same meaning (i.e. 1,l,L etc.).
        ///     The array must have exactly 32 elements. EncodeTo in each CharMap is the character used for encoding.
        ///     DecodeFrom in each CharMap contains a list of characters that decode. This allows you to decode 1 L l i and I all as having the same meaning.
        ///     The position in the array of CharMaps is the binary "value" encoded, i.e. position 0 to 31 in the array map to binary nibble values of 0 to 31.
        ///     NOTE: an alphabet such as crockford may result in a case insensitive decoding of text, but case SENSITIVE must be specified as true in cases
        ///           like this to provide a unique mapping during decoding, thus to create a crockford style map you must always include the upper and lower
        ///           decode mappings of any case insensitive decode characters required.
        /// </param>
        public Base32Url(bool padding, bool caseSensitive, bool ignoreWhiteSpaceWhenDecoding, CharMap[] alphabet)
        {
            if (alphabet.Length != 32)
            {
                throw new ArgumentException("Alphabet must be exactly 32 characters long for base 32 encoding.");
            }
            if (alphabet.Any(t => t.Decode == null || t.Decode.Length == 0))
            {
                throw new ArgumentException("Alphabet must contain at least one decoding character for any given encoding chharacter.");
            }
            var equality = caseSensitive ? StringComparer.InvariantCulture : StringComparer.InvariantCultureIgnoreCase;

            var encodingChars = alphabet.Select(t => t.Encode).GroupBy(k => k, equality).ToArray();
            if (encodingChars.Any(g => g.Count() > 1))
            {
                throw new ArgumentException("Case " + (caseSensitive ? "sensitive" : "insensitive") + " alphabet contains duplicate encoding characters: "
                    + string.Join(", ", encodingChars.Where(g => g.Count() > 1).Select(g => g.Key)));
            }

            var decodingChars = alphabet.SelectMany(t => t.Decode.Select(c => c)).GroupBy(k => k, equality).ToArray();
            if (decodingChars.Any(g => g.Count() > 1))
            {
                throw new ArgumentException("Case " + (caseSensitive ? "sensitive" : "insensitive") + " alphabet contains duplicate decoding characters: "
                    + string.Join(", ", decodingChars.Where(g => g.Count() > 1).Select(g => g.Key)));
            }


            PaddingChar = StandardPaddingChar;
            UsePadding = padding;
            IsCaseSensitive = caseSensitive;
            IgnoreWhiteSpaceWhenDecoding = ignoreWhiteSpaceWhenDecoding;

            _alphabet = alphabet;
        }

        /// <summary>
        /// Decode a base32 string to a byte[] using the default options
        /// (case insensitive without padding using the standard base32 alphabet from rfc4648).
        /// White space is not permitted (not ignored).
        /// Use alternative constructors for more options.
        /// </summary>
        public static byte[] FromBase32String(string input)
        {
            return new Base32Url().Decode(input);
        }

        /// <summary>
        /// Encode a base32 string from a byte[] using the default options
        /// (case insensitive without padding using the standard base32 alphabet from rfc4648).
        /// Use alternative constructors for more options.
        /// </summary>
        public static string ToBase32String(byte[] data)
        {
            return new Base32Url().Encode(data);
        }

        /// <summary>
        /// Converts a byte[] to a base32 string with the parameters provided in the constructor.
        /// </summary>
        /// <param name="data">bytes to encode</param>
        /// <returns>base 32 string</returns>
        public string Encode(byte[] data)
        {
            var result = new StringBuilder(Math.Max((int)Math.Ceiling(data.Length * 8 / 5.0), 1));

            var emptyBuff = new byte[] { 0, 0, 0, 0, 0, 0, 0, 0 };
            var buff = new byte[8];

            // take input five bytes at a time to chunk it up for encoding
            for (int i = 0; i < data.Length; i += 5)
            {
                int bytes = Math.Min(data.Length - i, 5);

                // parse five bytes at a time using an 8 byte ulong
                Array.Copy(emptyBuff, buff, emptyBuff.Length);
                Array.Copy(data, i, buff, buff.Length - (bytes + 1), bytes);
                Array.Reverse(buff);
                ulong val = BitConverter.ToUInt64(buff, 0);

                for (int bitOffset = ((bytes + 1) * 8) - 5; bitOffset > 3; bitOffset -= 5)
                {
                    result.Append(_alphabet[(int)((val >> bitOffset) & 0x1f)].Encode);
                }
            }

            if (UsePadding)
            {
                result.Append(string.Empty.PadRight((result.Length % 8) == 0 ? 0 : (8 - (result.Length % 8)), PaddingChar));
            }

            return result.ToString();
        }

        /// <summary>
        /// Decodes a base32 string back to the original binary based on the constructor parameters.
        /// </summary>
        /// <param name="input">base32 string</param>
        /// <returns>byte[] of data originally encoded with Encode method</returns>
        /// <exception cref="ArgumentException">Thrown when string is invalid length if padding is expected or invalid (not in the base32 decoding set) characters are provided.</exception>
        public byte[] Decode(string input)
        {
            if (IgnoreWhiteSpaceWhenDecoding)
            {
                input = Regex.Replace(input, "\\s+", "");
            }

            if (UsePadding)
            {
                if (input.Length % 8 != 0)
                {
                    throw new ArgumentException("Invalid length for a base32 string with padding.");
                }

                input = input.TrimEnd(PaddingChar);
            }

            // index the alphabet for decoding only when needed
            EnsureAlphabetIndexed();

            var ms = new MemoryStream(Math.Max((int)Math.Ceiling(input.Length * 5 / 8.0), 1));

            // take input eight bytes at a time to chunk it up for encoding
            for (int i = 0; i < input.Length; i += 8)
            {
                int chars = Math.Min(input.Length - i, 8);

                ulong val = 0;

                int bytes = (int)Math.Floor(chars * (5 / 8.0));

                for (int charOffset = 0; charOffset < chars; charOffset++)
                {
                    uint cbyte;
                    if (!_index.TryGetValue(input.Substring(i + charOffset, 1), out cbyte))
                    {
                        throw new ArgumentException("Invalid character '" + input.Substring(i + charOffset, 1) + "' in base32 string, valid characters are: " + _alphabet);
                    }

                    val |= (((ulong)cbyte) << ((((bytes + 1) * 8) - (charOffset * 5)) - 5));
                }

                byte[] buff = BitConverter.GetBytes(val);
                Array.Reverse(buff);
                ms.Write(buff, buff.Length - (bytes + 1), bytes);
            }

            return ms.ToArray();
        }

        private void EnsureAlphabetIndexed()
        {
            if (_index != null) return;

            Dictionary<string, uint> cidx;

            var indexKey = (IsCaseSensitive ? "S" : "I") +
                string.Join("", _alphabet.Select(t => t.Encode)) +
                "_" + string.Join("", _alphabet.SelectMany(t => t.Decode).Select(c => c));

            if (!_indexes.TryGetValue(indexKey, out cidx))
            {
                lock (_indexes)
                {
                    if (!_indexes.TryGetValue(indexKey, out cidx))
                    {
                        var equality = IsCaseSensitive ? StringComparer.InvariantCulture : StringComparer.InvariantCultureIgnoreCase;
                        cidx = new Dictionary<string, uint>(_alphabet.Length, equality);
                        for (int i = 0; i < _alphabet.Length; i++)
                        {
                            foreach (var c in _alphabet[i].Decode.Select(c => c))
                            {
                                cidx[c] = (uint)i;
                            }

                        }
                        _indexes.Add(indexKey, cidx);
                    }
                }
            }

            _index = cidx;
        }
    }

    /// <summary>
	/// Modified Base64 for URL applications ('base64url' encoding)
	/// 
	/// See http://tools.ietf.org/html/rfc4648
	/// For more information see http://en.wikipedia.org/wiki/Base64
	/// </summary>
	public class Base64Url
    {
        /// <summary>
        /// Modified Base64 for URL applications ('base64url' encoding)
        /// 
        /// See http://tools.ietf.org/html/rfc4648
        /// For more information see http://en.wikipedia.org/wiki/Base64
        /// </summary>
        /// <param name="input"></param>
        /// <returns>Input byte array converted to a base64ForUrl encoded string</returns>
        public static string ToBase64ForUrlString(byte[] input)
        {
            StringBuilder result = new StringBuilder(Convert.ToBase64String(input).TrimEnd('='));

            result.Replace('+', '-');
            result.Replace('/', '_');

            return result.ToString();
        }

        /// <summary>
        /// Modified Base64 for URL applications ('base64url' encoding)
        /// 
        /// See http://tools.ietf.org/html/rfc4648
        /// For more information see http://en.wikipedia.org/wiki/Base64
        /// </summary>
        /// <param name="base64ForUrlInput"></param>
        /// <returns>Input base64ForUrl encoded string as the original byte array</returns>
        public static byte[] FromBase64ForUrlString(string base64ForUrlInput)
        {
            int padChars = (base64ForUrlInput.Length % 4) == 0 ? 0 : (4 - (base64ForUrlInput.Length % 4));

            StringBuilder result = new StringBuilder(base64ForUrlInput, base64ForUrlInput.Length + padChars);
            result.Append(String.Empty.PadRight(padChars, '='));

            result.Replace('-', '+');
            result.Replace('_', '/');

            return Convert.FromBase64String(result.ToString());
        }
    }
}