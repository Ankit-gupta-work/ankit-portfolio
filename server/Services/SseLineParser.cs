using System.Text;

namespace Server.Services;

/// <summary>
/// Incrementally parses a raw Server-Sent Events byte/text stream into "data:" payload lines.
/// Stateful: safe to feed arbitrarily split chunks (e.g. a "data: " line split mid-token across
/// two network reads) — a partial trailing line is buffered until the next Feed call completes it.
/// </summary>
public class SseLineParser
{
    private readonly StringBuilder _buffer = new();

    /// <summary>Feeds a chunk of raw text and returns any complete "data:" payloads found in it.</summary>
    public IEnumerable<string> Feed(string chunk)
    {
        _buffer.Append(chunk);
        var text = _buffer.ToString();
        var lines = text.Split('\n');

        // The last element is either empty (chunk ended cleanly on \n) or a partial line — keep it buffered.
        _buffer.Clear();
        _buffer.Append(lines[^1]);

        var payloads = new List<string>();
        for (var i = 0; i < lines.Length - 1; i++)
        {
            var line = lines[i].TrimEnd('\r');
            if (line.StartsWith("data:", StringComparison.Ordinal))
            {
                payloads.Add(line["data:".Length..].Trim());
            }
        }

        return payloads;
    }
}
