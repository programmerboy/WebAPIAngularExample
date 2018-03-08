using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace WebAPI.Helpers
{
    public static class ExtensionMethods
    {

        /// <summary>
        /// This extension loops through all string, int, short, long, decimal properties and see if there is even one Property has value (non-default).
        /// </summary>
        /// <param name="myObject">An object with properties</param>
        /// <returns>True - Even if there is  one Property has value (non-default) </returns>
        public static bool IsAnyPropertySet(this object myObject)
        {
            bool isAnyPropertySet = false;
            var props = myObject.GetType().GetProperties();

            //If any string is set
            isAnyPropertySet = props.Where(pi => pi.GetValue(myObject) is string).Select(pi => (string)pi.GetValue(myObject)).Any(value => !String.IsNullOrWhiteSpace(value));
            if (isAnyPropertySet) { return isAnyPropertySet; }

            //If int string is set
            isAnyPropertySet = props.Where(pi => pi.GetValue(myObject) is int).Select(pi => (int)pi.GetValue(myObject)).Any(value => value > 0);
            if (isAnyPropertySet) { return isAnyPropertySet; }

            //If any short is set
            isAnyPropertySet = props.Where(pi => pi.GetValue(myObject) is short).Select(pi => (short)pi.GetValue(myObject)).Any(value => value > 0);
            if (isAnyPropertySet) { return isAnyPropertySet; }

            //If any long is set
            isAnyPropertySet = props.Where(pi => pi.GetValue(myObject) is long).Select(pi => (long)pi.GetValue(myObject)).Any(value => value > 0);
            if (isAnyPropertySet) { return isAnyPropertySet; }

            //If any decimal is set
            isAnyPropertySet = props.Where(pi => pi.GetValue(myObject) is decimal).Select(pi => (decimal)pi.GetValue(myObject)).Any(value => value > 0);
            if (isAnyPropertySet) { return isAnyPropertySet; }

            return isAnyPropertySet;
        }

        /// <summary>
        /// This extension method takes a string and searches for it in the source string. An optional Value [ignoreNullOrEmpty: true] can be specified to ignore Null or Empty Strings
        /// </summary>
        /// <param Name="source">Source of the string</param>
        /// <param Name="stringToMatch">String to Find in the Source</param>
        /// <param Name="ignoreNullOrEmpty">A bool Value to indicate whether to ignore Null or Empty values</param>
        /// <returns>Returns true if found</returns>
        public static bool CustomCompare(this string source, string stringToFind, bool ignoreNullOrEmpty = false)
        {
            if (ignoreNullOrEmpty && string.IsNullOrEmpty(stringToFind)) { return true; }
            return string.IsNullOrEmpty(source) ? false : source.IndexOf(stringToFind, StringComparison.OrdinalIgnoreCase) >= 0;
        }

        /// <summary>
        /// This extension method matches the exact string ignoring the casing.
        /// </summary>
        /// <param Name="source">Source of the string</param>
        /// <param Name="stringToMatch">String to Match in the Source</param>
        /// <param Name="ignoreNullOrEmpty">A bool Value to indicate whether to ignore Null or Empty values</param>
        /// <returns>Returns true if matched</returns>
        public static bool ExactMatch(this string source, string stringToMatch, bool ignoreNullOrEmpty = false)
        {
            if (ignoreNullOrEmpty && string.IsNullOrEmpty(stringToMatch)) { return true; }
            return String.Compare(source, stringToMatch, StringComparison.OrdinalIgnoreCase) == 0;
        }

        /// <summary>
        /// This extension method appends the / character at the end of URL.
        /// </summary>
        /// <param Name="source">Source of the string</param>
        /// <returns>A String URL properly formatted</returns>
        public static string FormatURL(this string source)
        {
            if (String.IsNullOrWhiteSpace(source)) { return source; }
            if (source.IndexOf("/", StringComparison.OrdinalIgnoreCase) < 0) { return source; }

            var lastIndexOf = source.LastIndexOf("/");
            var length = source.Length;

            if (lastIndexOf + 1 == length)
            { return source; }
            else { return source + "/"; }
        }

        public static string CleanSharePointValues(this string source)
        {
            if (source.Contains(";#")) { source = source.Substring(source.IndexOf(";#") + 2); }
            return source;
        }

        /// <summary>
        /// This extension method takes a string and returns a substring after the last "\" seperator character
        /// </summary>
        /// <param Name="source">Source of the string</param>
        /// <param Name="separator">An optional separator. Default is back slash character "\"</param>
        /// <returns></returns>
        public static string GetLastPart(this string source, char separator = ' ')
        {
            if (string.IsNullOrEmpty(source))
            { return String.Empty; }

            separator = separator == ' ' ? '\\' : separator;

            if (source.IndexOf(separator) < 0)
            { return source; }

            return source.Substring(source.LastIndexOf(separator) + 1);
        }

        /// <summary>
        /// This extension method takes a string and returns a substring until the first "\" seperator character
        /// </summary>
        /// <param Name="source">Source of the string</param>
        /// <param Name="separator">An optional separator. Default is back slash character "\"</param>
        /// <returns></returns>
        public static string GetFirstPart(this string source, char separator = ' ')
        {
            if (string.IsNullOrEmpty(source))
            { return String.Empty; }

            separator = separator == ' ' ? '\\' : separator;

            if (source.IndexOf(separator) < 0)
            { return source; }

            return source.Substring(0, source.IndexOf(separator) + 1);
        }

        /// <summary>
        /// This extension method checks whether the pass Type matches the object Type. Usuage ex [SomeStringArray.GetType().IsArrayOf<string>()]
        /// </summary>
        /// <typeparam Name="T"></typeparam>
        /// <param Name="Type"></param>
        /// <returns>Returns true or false Value indicating the match</returns>
        public static bool IsArrayOf<T>(this Type type)
        {
            return type == typeof(T[]);
        }

        /// <summary>
        /// This extension method takes an object and initializes empty (null) arrays to their default types
        /// </summary>
        /// <param Name="myObject">Any kind of Object</param>
        public static void InitializeEmptyArrays(this object myObject)
        {
            var allArrays = myObject.GetType().GetProperties().Where(p => p.CanRead && p.PropertyType.IsArray);
            Type propType;

            foreach (var prop in allArrays)
            {
                propType = prop.PropertyType;

                var value = (Array)prop.GetValue(myObject);

                if (value == null || value.Length < 1)
                {
                    if (propType.IsArrayOf<Int16[]>()) { prop.SetValue(myObject, Arrays<short>.Empty); }
                    else if (propType.IsArrayOf<Int32[]>()) { prop.SetValue(myObject, Arrays<int>.Empty); }
                    else if (propType.IsArrayOf<Int64[]>()) { prop.SetValue(myObject, Arrays<long>.Empty); }
                    else if (propType.IsArrayOf<string[]>()) { prop.SetValue(myObject, Arrays<string>.Empty); }
                }
            }//End of Foreach
        }

        /// <summary>
        /// This extension method takes an object and converts all String Properties to Upper Case
        /// </summary>
        /// <param Name="myObject">Any kind of Object</param>
        public static object ConvertToUpperCase<T>(this T myObject)
        {
            PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo prop in properties)
            {
                if (prop.PropertyType == typeof(string))
                {
                    var value = (string)prop.GetValue(myObject);
                    prop.SetValue(myObject, value.Trim().ToUpper());
                }
            }
            return myObject;
        }

        /// <summary>
        /// This extension method takes an object and converts all String Properties to Upper Case
        /// </summary>
        /// <param Name="myObject">Any kind of Object</param>
        public static T CleanString<T>(this T myObject)
        {
            PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo prop in properties)
            {
                if (prop.PropertyType == typeof(string))
                {
                    var value = (string)prop.GetValue(myObject);
                    prop.SetValue(myObject, value.Trim());
                }
            }
            return myObject;
        }

        public static bool IsDifferentObject<T>(this T curObject, T objToCompare, List<string> propNames, out string changed)
        {

            List<Type> mDataTypes = new List<Type>() { typeof(Int16), typeof(Int32), typeof(Int64), typeof(Double), typeof(Decimal), typeof(float) };
            Type propType;
            bool blnAtLeastOneDifferent = false;
            bool blnDifferent = false;
            StringBuilder sb = new StringBuilder();


            if (curObject.GetType() != objToCompare.GetType())
                throw new Exception(String.Format("{0} type is different than {1} type. Only same types should be compared.", curObject.GetType(), objToCompare.GetType()));

            var properties = curObject.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance).Where(r => propNames.Contains(r.Name));

            foreach (var prop in properties)
            {
                propType = prop.PropertyType;

                if (propType == typeof(string))
                {
                    var value1 = (string)prop.GetValue(curObject);
                    var value2 = (string)prop.GetValue(objToCompare);

                    blnDifferent = !value1.ExactMatch(value2);

                    if (blnDifferent)
                        sb.Append(String.Format("{0} changed from \"{1}\" to \"{2}\"; ", prop.Name, value2, value1));
                }
                else
                {
                    dynamic value1 = prop.GetValue(curObject);
                    dynamic value2 = prop.GetValue(objToCompare);

                    blnDifferent = !value1.Equals(value2);

                    if (blnDifferent)
                        sb.Append(String.Format("{0} changed from \"{1}\" to \"{2}\"; ", prop.Name, value2, value1));
                }

                if (blnDifferent && !blnAtLeastOneDifferent)
                    blnAtLeastOneDifferent = blnDifferent;

            }//End of For Loop

            changed = sb.ToString();

            return blnAtLeastOneDifferent;
        }

        public static Tuple<bool, string, List<string>> IsMatch(this string expression, string pattern)
        {
            var matchValue = String.Empty;
            var lstMatches = new List<string>();
            var r = new Regex(pattern, RegexOptions.IgnoreCase);
            var matches = r.Matches(expression);

            foreach (Match match in matches)
            {
                matchValue = match.Value;
                lstMatches.Add(matchValue);
            }

            var isMatch = matches.Count > 0;
            return Tuple.Create(isMatch, matchValue, lstMatches);
        }

    }

    public static class Arrays<T>
    {
        private static readonly T[] empty = new T[0];
        public static T[] Empty { get { return empty; } }
    }
}