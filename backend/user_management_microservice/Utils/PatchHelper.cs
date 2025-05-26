using System.Reflection;

namespace user_management_microservice.Utils;

public static class PatchHelper
{
    public static void PatchObject<TTarget, TSource>(TTarget target, TSource source)
    {
        if (target == null || source == null)
            throw new ArgumentNullException("Target and source must not be null");

        var sourceProps = typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var targetProps = typeof(TTarget).GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(p => p.Name, p => p, StringComparer.OrdinalIgnoreCase);

        foreach (var srcProp in sourceProps)
        {
            if (!srcProp.CanRead) continue;

            var value = srcProp.GetValue(source);
            if (value == null) continue;

            if (!targetProps.TryGetValue(srcProp.Name, out var targetProp) || !targetProp.CanWrite)
                continue;

            var sourceType = srcProp.PropertyType;
            var targetType = targetProp.PropertyType;

            if (targetType == sourceType)
            {
                targetProp.SetValue(target, value);
            }
            else
            {
                var underlyingSourceType = Nullable.GetUnderlyingType(sourceType);

                if (underlyingSourceType == null || underlyingSourceType != targetType) continue;

                var convertedValue = Convert.ChangeType(value, targetType);

                targetProp.SetValue(target, convertedValue);
            }
        }
    }
}