namespace NDP.Identity.Presentation.Configuration;

public class IdentitySettings
{
    public const string SectionName = "Identity";
    public bool RequireEmailConfirmation { get; set; }
    public bool RequirePhoneConfirmation { get; set; }
    public int MaxLoginAttempts { get; set; } = 5;
}
