namespace NDP.Audits.Presentation.Configuration;

public class AuditsSettings
{
    public const string SectionName = "Audits";
    public int DefaultPageSize { get; set; } = 20;
    public int MaxPageSize { get; set; } = 100;
}
