function updateBetweenMarkers(content, startMarker, endMarker, newContent) {
    // We splitsen de tekst op de markers
    const parts = content.split(startMarker);
    if (parts.length < 2) return null; // Start marker niet gevonden
  
    const subParts = parts[1].split(endMarker);
    if (subParts.length < 2) return null; // Eind marker niet gevonden na de start
  
    // parts[0] = alles VOOR de start marker
    // subParts[1] = alles NA de eind marker
    // We bouwen het bestand opnieuw op:
    return [
      parts[0],
      startMarker,
      `\n${newContent}\n`,
      endMarker,
      subParts[1]
    ].join('');
  }