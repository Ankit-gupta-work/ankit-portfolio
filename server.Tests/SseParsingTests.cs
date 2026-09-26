using Server.Services;
using Xunit;

namespace Server.Tests;

public class SseLineParserTests
{
    [Fact]
    public void Feed_ExtractsSingleCompleteDataLine()
    {
        var parser = new SseLineParser();
        var payloads = parser.Feed("data: {\"choices\":[]}\n").ToList();

        Assert.Single(payloads);
        Assert.Equal("{\"choices\":[]}", payloads[0]);
    }

    [Fact]
    public void Feed_BuffersPartialLineAcrossTwoChunks()
    {
        var parser = new SseLineParser();

        // First chunk ends mid-line — nothing complete yet.
        var firstBatch = parser.Feed("data: {\"choices\":[{\"delta\":{\"content\":\"Hel").ToList();
        Assert.Empty(firstBatch);

        // Second chunk completes the line.
        var secondBatch = parser.Feed("lo\"}}]}\n").ToList();
        Assert.Single(secondBatch);
        Assert.Equal("{\"choices\":[{\"delta\":{\"content\":\"Hello\"}}]}", secondBatch[0]);
    }

    [Fact]
    public void Feed_HandlesMultipleLinesInOneChunkIncludingDone()
    {
        var parser = new SseLineParser();
        var payloads = parser.Feed("data: {\"a\":1}\n\ndata: {\"a\":2}\n\ndata: [DONE]\n\n").ToList();

        Assert.Equal(3, payloads.Count);
        Assert.Equal("{\"a\":1}", payloads[0]);
        Assert.Equal("{\"a\":2}", payloads[1]);
        Assert.Equal("[DONE]", payloads[2]);
    }

    [Fact]
    public void Feed_IgnoresNonDataLines()
    {
        var parser = new SseLineParser();
        var payloads = parser.Feed(": comment\nevent: message\ndata: {\"a\":1}\n\n").ToList();

        Assert.Single(payloads);
        Assert.Equal("{\"a\":1}", payloads[0]);
    }
}

public class OpenAiStreamChunkParserTests
{
    [Fact]
    public void Parse_DoneSentinel_ReturnsIsDone()
    {
        var result = OpenAiStreamChunkParser.Parse("[DONE]");
        Assert.True(result.IsDone);
        Assert.Null(result.DeltaText);
    }

    [Fact]
    public void Parse_ExtractsDeltaContent()
    {
        var result = OpenAiStreamChunkParser.Parse(
            "{\"choices\":[{\"index\":0,\"delta\":{\"content\":\"Hello\"},\"finish_reason\":null}]}");

        Assert.False(result.IsDone);
        Assert.Equal("Hello", result.DeltaText);
    }

    [Fact]
    public void Parse_FinalChunkWithEmptyDelta_ReturnsNullDelta()
    {
        var result = OpenAiStreamChunkParser.Parse(
            "{\"choices\":[{\"index\":0,\"delta\":{},\"finish_reason\":\"stop\"}]}");

        Assert.False(result.IsDone);
        Assert.Null(result.DeltaText);
    }

    [Fact]
    public void Parse_UsageChunk_ExtractsTokenCounts()
    {
        var result = OpenAiStreamChunkParser.Parse(
            "{\"choices\":[],\"usage\":{\"prompt_tokens\":42,\"completion_tokens\":13}}");

        Assert.Equal(42, result.PromptTokens);
        Assert.Equal(13, result.CompletionTokens);
    }

    [Fact]
    public void Parse_MalformedJson_DoesNotThrow()
    {
        var result = OpenAiStreamChunkParser.Parse("{not valid json");
        Assert.False(result.IsDone);
        Assert.Null(result.DeltaText);
    }
}
