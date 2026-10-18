using Microsoft.Extensions.Configuration;
using Server.Options;
using Xunit;

namespace Server.Tests;

public class AiOptionsTests
{
    [Fact]
    public void FromEnvironment_DefaultAllowedOrigins_IncludesLocalDevPorts()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["AI_BASE_URL"] = "https://example.com/api/v1",
                ["AI_API_KEY"] = "test-key",
                ["AI_MODEL"] = "test-model",
            })
            .Build();

        var options = AiOptions.FromEnvironment(configuration);

        Assert.Contains("http://localhost:4200", options.AllowedOriginsArray);
        Assert.Contains("http://localhost:4201", options.AllowedOriginsArray);
    }
}
