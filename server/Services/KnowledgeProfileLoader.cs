namespace Server.Services;

public interface IKnowledgeProfileLoader
{
    string Profile { get; }
}

/// <summary>Loads knowledge/ankit-profile.md once at startup and caches it in memory.</summary>
public class KnowledgeProfileLoader : IKnowledgeProfileLoader
{
    public string Profile { get; }

    public KnowledgeProfileLoader(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "knowledge", "ankit-profile.md");
        Profile = File.Exists(path)
            ? File.ReadAllText(path)
            : throw new FileNotFoundException($"Knowledge profile not found at {path}");
    }
}
