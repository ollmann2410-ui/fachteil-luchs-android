(function(){
  'use strict';
  if(window.__FachteilBinderTrainerV201Patch)return;
  window.__FachteilBinderTrainerV201Patch=true;

  function $(sel,root){return (root||document).querySelector(sel);}
  function $all(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  function cleanText(s){
    s=String(s==null?'':s);
    var reps=[
      [/laut\s+(?:der\s+)?Mastertabelle/gi,''],
      [/laut\s+(?:der\s+)?Unterrichtstabelle/gi,''],
      [/laut\s+(?:der\s+)?Tabelle/gi,''],
      [/nach\s+(?:der\s+)?Mastertabelle/gi,''],
      [/nach\s+(?:der\s+)?Unterrichtstabelle/gi,''],
      [/nach\s+(?:der\s+)?Tabelle/gi,''],
      [/in\s+der\s+Mastertabelle/gi,''],
      [/in\s+der\s+Unterrichtstabelle/gi,''],
      [/in\s+der\s+Tabelle/gi,''],
      [/der\s+Mastertabelle/gi,'der fachlichen Grundlage'],
      [/die\s+Mastertabelle/gi,'die fachliche Grundlage'],
      [/der\s+Unterrichtstabelle/gi,'der fachlichen Grundlage'],
      [/die\s+Unterrichtstabelle/gi,'die fachliche Grundlage'],
      [/Unterrichts-Lösungsbogen/gi,'fachlichen Grundlage'],
      [/Organische-Bindemittel-Lösungsbogen/gi,'fachlichen Grundlage'],
      [/Weitere Bindemittel-Lösungsbogen/gi,'fachlichen Grundlage'],
      [/2K-Lösungsbogen/gi,'fachlichen Grundlage'],
      [/Ergänzungs-Lösungsbogen/gi,'fachlichen Grundlage'],
      [/Lösungsbogen/gi,'fachlichen Grundlage'],
      [/Unterrichtsunterlagen/gi,'fachlichen Grundlage'],
      [/Weitere Hinweise der Tabelle:/gi,'Weitere Grenzen:'],
      [/Angabe der fachlichen Grundlage/gi,''],
      [/\s{2,}/g,' '],
      [/\s+([,.;:])/g,'$1']
    ];
    reps.forEach(function(r){s=s.replace(r[0],r[1]);});
    return s.trim();
  }

  var PATCHES={
    'Welche drei Bindemittel gehören in der Mastertabelle zur ersten anorganischen Gruppe?':{
      prompt:'Welche Kombination besteht ausschließlich aus anorganischen Bindemitteln?',
      options:['Kalk, Zement, Lehm','Kalk, Zement, Kasein','Reinsilikat, Lehm, Alkydharz','Dispersionssilikat, Sol-Silikat, Bitumen'],
      why:'Kalk, Zement und Lehm gehören zu den anorganischen Bindemitteln.'
    },
    'Welche drei Silikat-Systeme werden direkt miteinander verglichen?':{
      prompt:'Welche drei Systeme gehören zur Silikat-Familie?',
      options:['Reinsilikat, Dispersionssilikat, Sol-Silikat','Reinsilikat, Dispersionssilikat, Silikonharz','Sol-Silikat, Silikonharz, Kalk','Reinsilikat, Kunststoffdispersion, Sol-Silikat'],
      why:'Reinsilikat, Dispersionssilikat und Sol-Silikat gehören zur Silikat-Familie.'
    },
    'Welche Gruppe enthält Methylcellulose, Leime und Kasein?':{
      prompt:'Welche Einordnung trifft auf Methylcellulose, Leime und Kasein zu?',
      options:['Organische Bindemittel','Anorganische Bindemittel','Hydraulische Bindemittel','Silikatische Bindemittel'],
      why:'Methylcellulose, Leime und Kasein sind organische Bindemittel.'
    },
    'Welches Bindemittel ist laut Tabelle besonders mit Restaurierung und Denkmalpflege verknüpft?':{
      prompt:'Welches Bindemittel wird besonders mit historischer Restaurierung und Denkmalpflege verbunden?',
      options:['Kasein','Methylcellulose','Leim','Lehm'],
      why:'Kasein wird im Lernstoff besonders der historischen Restaurierung und Denkmalpflege zugeordnet.'
    },
    'Welches Bindemittel ist der Hauptbestandteil vieler Tapetenkleister?':{
      prompt:'Welches Bindemittel ist ein typischer Hauptbestandteil vieler Tapetenkleister?',
      options:['Methylcellulose','Kasein','Haut- und Knochenleim','Kunststoffdispersion'],
      why:'Methylcellulose ist ein typisches Bindemittel für wasserlösliche Tapetenkleister.'
    },
    'Welche Kombination gehört zusammen?':{
      prompt:'Aus welchem Ausgangsstoff wird Leinöl gewonnen?',
      options:['Flachsamen','Milcheiweiß','Erdöldestillationsrückstand','Zellulose'],
      why:'Leinöl wird aus den Samen des Flachses gewonnen.'
    },
    'Welcher Stoff ist laut Tabelle der Rückstand einer Erdöldestillation?':{
      prompt:'Welches Bindemittel entsteht als Rückstand bei der Erdöldestillation?',
      options:['Bitumen','Kasein','Leinöl','Methylcellulose'],
      why:'Bitumen ist ein Rückstand der Erdöldestillation.'
    },
    'Welche drei Systeme stehen auf Seite 6 der Mastertabelle als Überschriften, deren Felder aber leer sind?':{
      prompt:'Welche beiden Bindemittelgruppen werden häufig als 2K-Reaktionsharze eingesetzt?',
      options:['Epoxidharz und Polyurethan','Alkydharz und Nitrolack','Kalk und Zement','Lehm und Methylcellulose'],
      why:'Epoxidharz- und Polyurethan-Systeme werden häufig als chemisch reagierende 2K-Beschichtungsstoffe eingesetzt.'
    },
    'Welches System enthält laut Mastertabelle Silikonharz UND Kunststoffdispersion?':{
      prompt:'Welches System kombiniert Silikonharz mit Kunststoffdispersion?',
      options:['Silikonharzmikroemulsion','Reinsilikat','Dispersionssilikat','Sol-Silikat'],
      why:'Die Silikonharzmikroemulsion ist ein Mischsystem aus Silikonharz und Kunststoffdispersion.'
    },
    'Welches Bindemittel wird in der Mastertabelle ausdrücklich als „nicht filmbildend“ beschrieben?':{
      prompt:'Welches Bindemittel wirkt durch Verkieselung und bildet keinen klassischen Kunststofffilm?',
      options:['Reinsilikat','Dispersionssilikat','Kunststoffdispersion','Silikonharzmikroemulsion'],
      why:'Reinsilikat verbindet sich durch Verkieselung mit einem geeigneten mineralischen Untergrund und wird nicht als klassisch filmbildend eingeordnet.'
    },

    'Welche Kombination beschreibt Kunststoffdispersionen laut Tabelle am besten?':{
      prompt:'Welche Abfolge beschreibt die Filmbildung einer Kunststoffdispersion am besten?',
      options:['Wasser verdunstet → Kunststoffteilchen nähern sich → kalter Fluss → Film','Wasser reagiert chemisch → hydraulisches Abbinden → Film','CO₂ wird aufgenommen → Carbonatisierung → Film','Lösemittel verdunstet → Oxidation des mineralischen Untergrunds'],
      why:'Nach dem Verdunsten des Wassers rücken die Kunststoffteilchen zusammen und bilden durch kalten Fluss einen zusammenhängenden Film.'
    },
    'Wie erhärten trocknende Öle wie Leinöl?':{
      prompt:'Durch welchen Vorgang erhärten trocknende Öle wie Leinöl chemisch?',
      options:['Oxidation durch Sauerstoffaufnahme','Carbonatisierung durch CO₂-Aufnahme','Hydraulisches Abbinden durch Wasseraufnahme','Verkieselung mit mineralischen Untergründen'],
      why:'Trocknende Öle erhärten durch Sauerstoffaufnahme, also durch Oxidation.'
    },
    'Welche Aussage zu Lehm ist richtig?':{
      prompt:'Welche Aussage beschreibt die Erhärtung von Lehm richtig?',
      options:['Er trocknet physikalisch und bleibt mit Wasser reversibel.','Er oxidiert und wird dadurch irreversibel.','Er verkieselt mit mineralischen Untergründen.','Er reagiert als 2K-System mit einem Härter.'],
      why:'Bei Lehm verdunstet Wasser; eine chemische Erhärtung findet nicht statt. Deshalb bleibt er mit Wasser reversibel.'
    },
    'Was ist bei Methylcellulose die entscheidende Trocknungsart?':{
      prompt:'Wie trocknet Methylcellulose im Kleister hauptsächlich?',
      options:['Physikalisch durch Verdunsten von Wasser','Chemisch durch Oxidation','Chemisch durch Verkieselung','Hydraulisch durch Wasseraufnahme'],
      why:'Methylcellulose trocknet physikalisch durch Wasserverdunstung und bleibt mit Wasser reversibel.'
    },
    'Was bedeutet „2K“ im Unterrichtskontext?':{
      prompt:'Was kennzeichnet einen 2K-Beschichtungsstoff?',
      options:['Stammlack und passender Härter werden vor der Verarbeitung gemischt.','Grund- und Deckbeschichtung werden immer gleichzeitig aufgetragen.','Zwei Farbtöne werden zu einem neuen Farbton gemischt.','Ein Lack wird grundsätzlich in zwei Schichten verarbeitet.'],
      why:'Bei einem 2K-System werden zwei aufeinander abgestimmte Komponenten gemischt und reagieren anschließend chemisch miteinander.'
    },
    'Sind ausreagierte 2K-Beschichtungsstoffe reversibel?':{
      prompt:'Wie ist ein vollständig ausreagierter 2K-Beschichtungsstoff hinsichtlich Reversibilität einzuordnen?',
      options:['Nicht reversibel, weil eine chemische Reaktion stattgefunden hat.','Mit dem ursprünglichen Verdünnungsmittel vollständig reversibel.','Mit Wasser grundsätzlich reversibel.','Nur durch Erwärmen reversibel.'],
      why:'Nach der chemischen Reaktion lässt sich der ausgehärtete 2K-Film nicht wieder in den ursprünglichen Zustand zurückführen.'
    },
    'Was ist die Topfzeit?':{
      prompt:'Was bezeichnet die Topfzeit bei einem 2K-Beschichtungsstoff?',
      options:['Die Zeitspanne, in der das angemischte Material verarbeitbar bleibt.','Die Zeit bis zur Staubtrockenheit der Beschichtung.','Die Mindestwartezeit zwischen Grund- und Deckbeschichtung.','Die Lagerdauer der ungeöffneten Einzelkomponenten.'],
      why:'Nach dem Mischen läuft die chemische Reaktion. Die Topfzeit endet, wenn das Material nicht mehr ordnungsgemäß verarbeitet werden kann.'
    },

    'Reinsilikat oder Dispersionssilikat: Welches ist laut Tabelle 2-komponentig und nicht lagerfähig?':{
      prompt:'Reinsilikat oder Dispersionssilikat: Welches System ist klassisch 2-komponentig und nach dem Anmischen nicht lagerfähig?',
      options:['Reinsilikat','Dispersionssilikat','Beide Systeme','Keines der beiden Systeme'],
      why:'Reinsilikat wird aus Fixativ und Farbpulver angesetzt. Dispersionssilikat ist dagegen als 1-komponentiges, lagerfähiges System ausgelegt.'
    },
    'Dispersionssilikat oder Sol-Silikat: Was ist das Zusatzmerkmal von Sol-Silikat?':{
      prompt:'Dispersionssilikat oder Sol-Silikat: Welcher zusätzliche Bestandteil kennzeichnet Sol-Silikat?',
      options:['5–15 % Kieselsol','Ein deutlich erhöhter Kunststoffdispersionsanteil ohne Kieselsol','Ein zusätzlicher Silikonharzanteil zur Hydrophobierung','Ausschließlich mehr Kaliwasserglas ohne weiteren Zusatz'],
      why:'Sol-Silikat enthält zusätzlich Kieselsol. Dieser Anteil verbessert insbesondere Haftung und Festigung.'
    },
    'Kalk oder Zement: Wer härtet laut Tabelle auch unter Wasser?':{
      prompt:'Kalk oder Zement: Welches Bindemittel kann aufgrund seines Erhärtungsmechanismus auch unter Wasser erhärten?',
      options:['Zement','Luftkalk','Beide gleichermaßen','Keines der beiden'],
      why:'Zement bindet hydraulisch ab. Wasser ist Bestandteil der chemischen Reaktion.'
    },
    'Reinsilikat oder Kunststoffdispersion: Welches ist laut Tabelle nicht filmbildend?':{
      prompt:'Reinsilikat oder Kunststoffdispersion: Welches System bildet keinen klassischen Kunststofffilm?',
      options:['Reinsilikat','Kunststoffdispersion','Beide Systeme','Keines der beiden'],
      why:'Reinsilikat verkieselt mit einem geeigneten mineralischen Untergrund. Kunststoffdispersion bildet durch kalten Fluss einen Film.'
    },
    'Silikonharz oder Kunststoffdispersion: Welches wird besonders als hoch wasserabweisend UND hochdiffusionsfähig beschrieben?':{
      prompt:'Silikonharz oder Kunststoffdispersion: Welches Bindemittel verbindet besonders hohe Wasserabweisung mit hoher Diffusionsfähigkeit?',
      options:['Silikonharz','Kunststoffdispersion','Beide in gleichem Maß','Keines der beiden'],
      why:'Die Kombination aus hoher Wasserabweisung und hoher Diffusionsfähigkeit ist ein zentrales Merkmal von Silikonharzen.'
    },
    'Lehm oder Zement: Welches Bindemittel ist laut Tabelle mit Wasser reversibel?':{
      prompt:'Lehm oder Zement: Welches Bindemittel kann nach dem Trocknen durch Wasser wieder erweicht werden?',
      options:['Lehm','Zement','Beide','Keines'],
      why:'Lehm hat keine chemische Erhärtung und bleibt wasserreversibel. Zement reagiert hydraulisch und ist danach irreversibel.'
    },
    'Silikonharz oder Silikonharzmikroemulsion: Welches System ist durch den Kunststoffdispersionsanteil ausdrücklich filmbildend?':{
      prompt:'Silikonharz oder Silikonharzmikroemulsion: Welches System bildet durch seinen Kunststoffdispersionsanteil ausdrücklich einen Film?',
      options:['Silikonharzmikroemulsion','Reines Silikonharz','Beide Systeme gleich','Keines der beiden'],
      why:'Die Silikonharzmikroemulsion enthält einen hohen Kunststoffdispersionsanteil und ist deshalb filmbildend.'
    },

    'Ein klassischer Alkydharzlack soll DIREKT auf Zink aufgetragen werden. Wie lautet die Prüfungs-Grundregel?':{
      prompt:'Ein klassischer Alkydharzlack soll direkt auf verzinkten Stahl. Welche Aussage ist als Grundregel richtig?',
      options:['Direkter Auftrag ist ungeeignet; ein dafür freigegebenes System bzw. eine geeignete Grundbeschichtung ist erforderlich.','Gründliches Anschleifen macht jeden Alkydharzlack für den Direktauftrag geeignet.','Eine größere Schichtdicke verhindert die problematische Reaktion mit Zink.','Zink ist ohne Einschränkung ein Idealuntergrund für klassische Alkydharzlacke.'],
      why:'Klassische Alkydharzlacke gelten für den direkten Auftrag auf Zink als ungeeignet. Entscheidend ist ein dafür freigegebenes Beschichtungssystem.'
    },
    'Welcher Untergrund passt grundsätzlich am besten zu Reinsilikat?':{
      prompt:'Welcher Untergrund passt grundsätzlich am besten zu Reinsilikat?',
      options:['Ein geeigneter mineralischer, verkieselungsfähiger Untergrund','Eine elastische organische Altbeschichtung','Verzinkter Stahl ohne Grundbeschichtung','Ein nicht saugender Kunststoffuntergrund'],
      why:'Reinsilikat benötigt einen geeigneten mineralischen Untergrund, mit dem das Bindemittel verkieseln kann.'
    },
    'Methylcellulose-Kleister im dauerfeuchten Außenbereich?':{
      prompt:'Wie ist Methylcellulose-Kleister für einen dauerhaft feuchten Außenbereich zu beurteilen?',
      options:['Ungeeignet, weil das Bindemittel wasserempfindlich und reversibel ist.','Geeignet, sobald der Untergrund ausreichend saugfähig ist.','Bedingt geeignet, wenn nur besonders dick aufgetragen wird.','Besonders geeignet, weil hohe Adhäsion automatisch Wasserbeständigkeit bedeutet.'],
      why:'Methylcellulose ist wasserreversibel. Dauerhafte Feuchte und Außenbewitterung passen daher nicht zu diesem Bindemittel.'
    },
    'Lehm auf einer geeigneten mineralischen Innenfläche?':{
      prompt:'Wie ist Lehm auf einer geeigneten mineralischen Innenfläche grundsätzlich einzuordnen?',
      options:['Geeignet','Nur nach einer 2K-Grundbeschichtung geeignet','Nur auf nicht saugenden Untergründen geeignet','Im Innenbereich grundsätzlich ungeeignet'],
      why:'Lehm ist für geeignete mineralische Untergründe im Innenbereich grundsätzlich einsetzbar.'
    },
    'Welches Bindemittel nennt die Tabelle zusätzlich auch für Holz als geeigneten Untergrund?':{
      prompt:'Welches der folgenden anorganischen Bindemittel wird auch für Holz als geeigneten Untergrund genannt?',
      options:['Lehm','Kalk','Zement','Reinsilikat'],
      why:'Lehm wird neben mineralischen Untergründen auch Holz als möglichem Untergrund zugeordnet.'
    },
    'Welche Aussage zu Kunststoffdispersion und Luftkalk (PI a) entspricht der Tabelle?':{
      prompt:'Warum kann eine dichte Kunststoffdispersionsbeschichtung auf Luftkalk problematisch sein?',
      options:['Sie kann die CO₂-Zufuhr behindern, die der Luftkalk zur Carbonatisierung benötigt.','Sie beschleunigt die Carbonatisierung durch zusätzliche Wasseraufnahme.','Sie führt zur Verkieselung des Luftkalks.','Sie bewirkt hydraulisches Abbinden des Luftkalks.'],
      why:'Luftkalk benötigt CO₂ aus der Luft zur Carbonatisierung. Eine zu dichte Beschichtung kann diese Zufuhr behindern.'
    },
    'Kasein in dauerhaft feuchten Außenbereichen?':{
      prompt:'Wie ist Kasein für dauerhaft feuchte Außenbereiche einzuordnen?',
      options:['Ungeeignet','Geeignet, wenn der Untergrund alkalisch ist','Nur auf Metall geeignet','Besonders geeignet wegen seiner Wasserreversibilität'],
      why:'Dauerhafte Feuchte und Außenbewitterung gehören nicht zu den vorgesehenen Einsatzbedingungen von Kaseinbindemitteln.'
    },
    'Nitrolack auf stark alkalischem Untergrund?':{
      prompt:'Wie ist Nitrolack auf einem stark alkalischen Untergrund grundsätzlich einzuordnen?',
      options:['Ungeeignet','Geeignet, weil Nitroverdünnung die Alkalität neutralisiert','Geeignet, wenn die Schicht besonders dünn ausgeführt wird','Nur bei hoher Luftfeuchte geeignet'],
      why:'Stark alkalische Untergründe gelten für Nitrolacke als ungeeignet.'
    },
    'Naturöl/Leinöl auf Holz?':{
      prompt:'Für welchen Untergrund ist ein trocknendes Naturöl wie Leinöl grundsätzlich typisch geeignet?',
      options:['Holz','Frischer Zementputz als alleiniger Regelfall','Verzinkter Stahl ohne Vorbehandlung','Elastischer Kunststoff'],
      why:'Holz gehört zu den typischen Einsatzgebieten trocknender Naturöle.'
    },
    'Silikonharz wird laut Tabelle bei den geeigneten Untergründen wie eingeordnet?':{
      prompt:'Welche Aussage beschreibt den Einsatzbereich von Silikonharz am treffendsten?',
      options:['Breit einsetzbar, besonders als diffusionsoffenes und wasserabweisendes Fassadenbindemittel','Nur für Stahloberflächen geeignet','Ausschließlich für nicht saugende Kunststoffe geeignet','Nur als wasserreversibler Innenklebstoff geeignet'],
      why:'Silikonharz ist breit einsetzbar und verbindet besonders hohe Wasserabweisung mit hoher Diffusionsfähigkeit.'
    },
    '2K-Lacke: Welche Aussage ist nach den Unterrichtsunterlagen richtig?':{
      prompt:'Welche Aussage zu 2K-Beschichtungsstoffen ist fachlich richtig?',
      options:['Es gibt Systeme für unterschiedliche Untergründe; die Eignung richtet sich nach dem konkreten Produktaufbau.','Jeder 2K-Lack ist automatisch für jeden Untergrund geeignet.','2K-Lacke dürfen ausschließlich auf Holz verwendet werden.','2K-Lacke sind grundsätzlich nur für mineralische Untergründe vorgesehen.'],
      why:'2K bezeichnet den Reaktionsmechanismus aus zwei Komponenten, nicht eine pauschale Untergrundeignung. Entscheidend ist das konkrete System.'
    },
    'Lösemittelhaltige Acrylharzwandfarben werden im Lösungsbogen besonders für welchen Untergrundvorteil genannt?':{
      prompt:'Welcher Untergrundvorteil wird lösemittelhaltigen Acrylharzwandfarben besonders zugeschrieben?',
      options:['Sie können für alkalische Untergründe geeignet sein.','Sie sind ausschließlich für verzinkten Stahl geeignet.','Sie dürfen grundsätzlich nicht auf mineralischen Untergründen eingesetzt werden.','Sie erhärten durch Verkieselung mit Holz.'],
      why:'Als besonderer Vorteil wird ihre Eignung für alkalische Untergründe genannt.'
    },

    'Fall: Eine mineralische Innenfläche soll hoch diffusionsfähig und ohne klassischen Kunststofffilm beschichtet werden. Welches Bindemittelprinzip passt am ehesten?':{
      prompt:'Fall: Eine geeignete mineralische Innenfläche soll hoch diffusionsfähig und ohne klassischen Kunststofffilm beschichtet werden. Welches System passt am ehesten?',
      options:['Reinsilikat','Dispersionssilikat','Sol-Silikat','Kunststoffdispersion'],
      why:'Reinsilikat verkieselt mit einem geeigneten mineralischen Untergrund, ist hoch diffusionsfähig und bildet keinen klassischen Kunststofffilm.'
    },
    'Fall: Ein Material soll auch unter Wasser chemisch weiter erhärten können. Welcher Fachmechanismus passt?':{
      prompt:'Fall: Ein Bindemittel soll durch Wasser chemisch erhärten und auch unter Wasser weiter abbinden können. Welcher Mechanismus passt?',
      options:['Hydraulisches Abbinden','Carbonatisierung','Verkieselung','Oxidation'],
      why:'Hydraulisches Abbinden ist eine chemische Reaktion mit Wasser. Zement kann deshalb auch unter Wasser erhärten.'
    },
    'Fall: Ein reversibler Klebstoff für Tapezierarbeiten soll mit Wasser wieder lösbar sein. Welches Bindemittel passt?':{
      prompt:'Fall: Für Tapezierarbeiten wird ein typischer Kleister gesucht, der nach dem Trocknen mit Wasser wieder lösbar bleibt. Welches Bindemittel passt am besten?',
      options:['Methylcellulose','Kasein','Kunststoffdispersion','Alkydharz'],
      why:'Methylcellulose ist ein typisches Kleisterbindemittel, trocknet physikalisch und bleibt mit Wasser reversibel.'
    },
    'Fall: Eine stark beanspruchte Oberfläche benötigt ein chemisch härtendes, hartes und widerstandsfähiges System. Welches Unterrichtsprinzip passt?':{
      prompt:'Fall: Eine stark beanspruchte Oberfläche benötigt ein chemisch härtendes, hartes und widerstandsfähiges Beschichtungssystem. Was passt am besten?',
      options:['Ein passend ausgewähltes 2K-Epoxidharz- oder PUR-System','Ein rein physikalisch trocknender Nitrolack','Ein wasserreversibler Methylcellulosefilm','Eine Lehmfarbe ohne zusätzliche Systemkomponenten'],
      why:'Für hohe mechanische und chemische Beanspruchung kommen passend ausgewählte 2K-Reaktionsharzsysteme in Betracht.'
    },
    'Fall: Ein Lernender verwechselt Sol-Silikat mit Dispersionssilikat. Welches eine Merkmal trennt sie am schnellsten?':{
      prompt:'Fall: Sol-Silikat und Dispersionssilikat werden verwechselt. Welches Zusatzmerkmal kennzeichnet Sol-Silikat?',
      options:['Zusätzlicher Kieselsol-Anteil','Höherer Kunststoffdispersionsanteil ohne Kieselsol','Zusätzlicher Silikonharzanteil','Oxidativ trocknender Leinölanteil'],
      why:'Sol-Silikat enthält zusätzlich Kieselsol.'
    },
    'Fall: Eine Beschichtung soll schnell physikalisch trocknen und später mit dem passenden Verdünner wieder anlösend sein. Was passt?':{
      prompt:'Fall: Eine Beschichtung soll schnell physikalisch trocknen und später mit dem passenden Lösemittel wieder angelöst werden können. Welches System passt?',
      options:['Nitrolack','Alkydharzlack','2K-Epoxidharz','2K-PUR'],
      why:'Nitrolack trocknet schnell physikalisch und bleibt mit Nitroverdünnung reversibel.'
    },
    'Fall: Ein klassischer Alkydharzlack soll direkt auf verzinktem Stahl eingesetzt werden. Was muss zuerst auffallen?':{
      prompt:'Fall: Ein klassischer Alkydharzlack soll direkt auf verzinkten Stahl. Was ist zuerst zu prüfen?',
      options:['Ob ein für Zink freigegebenes System bzw. eine geeignete Grundbeschichtung vorgesehen ist.','Ob lediglich eine größere Schichtdicke gewählt werden kann.','Ob der Alkydharzlack mit Wasser verdünnt werden kann.','Ob auf jede Vorbehandlung verzichtet werden kann.'],
      why:'Klassische Alkydharzlacke gelten für den Direktauftrag auf Zink als ungeeignet. Ein freigegebener Systemaufbau ist entscheidend.'
    },
    'Fall: Gesucht wird ein natürliches Bindemittel mit langer Offenzeit, gutem Eindringvermögen und chemischer Erhärtung durch Sauerstoff.':{
      prompt:'Fall: Gesucht wird ein natürliches Bindemittel mit gutem Eindringvermögen und chemischer Erhärtung durch Sauerstoffaufnahme. Was passt?',
      options:['Leinöl / trocknendes Naturöl','Kasein','Lehm','Methylcellulose'],
      why:'Trocknende Naturöle wie Leinöl dringen gut in geeignete Untergründe ein und erhärten durch Oxidation.'
    },
    'Fall: Eine Fassadenbeschichtung soll hoch wasserabweisend, zugleich hochdiffusionsfähig sowie witterungs- und UV-beständig sein. Welche Bindemittelgruppe passt nach Tabelle besonders?':{
      prompt:'Fall: Eine Fassadenbeschichtung soll stark wasserabweisend, zugleich hoch diffusionsfähig sowie witterungs- und UV-beständig sein. Welche Bindemittelgruppe passt besonders?',
      options:['Silikonharz','Dispersionssilikat','Sol-Silikat','Kunststoffdispersion'],
      why:'Silikonharz verbindet besonders ausgeprägt hohe Wasserabweisung mit hoher Diffusionsfähigkeit sowie guter Witterungs- und UV-Beständigkeit.'
    },
    'Fall: Warum darf man „2K-Lack“ nicht mit „Zweischichtlack“ gleichsetzen?':{
      prompt:'Fall: Warum sind „2K-Lack“ und „Zweischichtlack“ nicht dasselbe?',
      options:['2K beschreibt zwei reagierende Komponenten; Zweischicht beschreibt zwei nacheinander ausgeführte Lackschichten.','2K beschreibt immer zwei Farbtöne; Zweischicht beschreibt zwei Härter.','2K und Zweischicht bezeichnen denselben chemischen Aufbau.','Zweischicht bedeutet grundsätzlich Stammlack plus Härter.'],
      why:'2K bezieht sich auf die Komponenten des Materials. Zweischicht beschreibt dagegen den Schichtaufbau.'
    },

    'Tabelle · Kalk · Chemische Erhärtung = ?':{
      prompt:'Durch welchen Vorgang erhärtet Luftkalk chemisch?',
      options:['Carbonatisierung','Hydraulisches Abbinden','Verkieselung','Oxidation'],
      why:'Luftkalk nimmt CO₂ aus der Luft auf und erhärtet durch Carbonatisierung.'
    },
    'Tabelle · Zement · Reversibel = ?':{
      prompt:'Ist vollständig erhärteter Zement mit Wasser wieder reversibel?',
      options:['Nein','Ja, weil Wasser sein Verdünnungsmittel ist','Ja, solange die Oberfläche feucht bleibt','Nur durch erneute CO₂-Aufnahme'],
      why:'Zement reagiert hydraulisch mit Wasser. Nach der chemischen Erhärtung ist dieser Vorgang nicht reversibel.'
    },
    'Tabelle · Lehm · Reversibel = ?':{
      prompt:'Wie verhält sich getrockneter Lehm gegenüber Wasser?',
      options:['Er ist mit Wasser wieder erweichbar und damit reversibel.','Er ist nach dem Trocknen chemisch irreversibel.','Er wird nur durch organische Lösemittel reversibel.','Er kann ausschließlich durch Oxidation wieder erweicht werden.'],
      why:'Lehm trocknet physikalisch und kann durch Wasser wieder erweicht werden.'
    },
    'Tabelle · Reinsilikat · Chemische Erhärtung = ?':{
      prompt:'Welcher chemische Vorgang kennzeichnet Reinsilikat auf einem geeigneten mineralischen Untergrund?',
      options:['Verkieselung','Oxidation','Hydraulisches Abbinden','Carbonatisierung'],
      why:'Reinsilikat reagiert mit einem geeigneten mineralischen Untergrund durch Verkieselung.'
    },
    'Tabelle · Dispersionssilikat · Bindemittel = ?':{
      prompt:'Wie ist Dispersionssilikat im Vergleich zu Reinsilikat aufgebaut?',
      options:['Fixativ plus ein kleiner Kunststoffdispersionsanteil','Fixativ plus Silikonharz ohne Kunststoffdispersion','Ausschließlich Kunststoffdispersion ohne Wasserglas','Leinöl plus mineralischer Füllstoff'],
      why:'Dispersionssilikat kombiniert das silikatische Bindemittel mit einem kleinen Kunststoffdispersionsanteil.'
    },
    'Tabelle · Sol-Silikat · Zusatz = ?':{
      prompt:'Welcher zusätzliche Bestandteil unterscheidet Sol-Silikat vom Dispersionssilikat?',
      options:['Kieselsol','Silikonharz','Leinöl','Polyisocyanat'],
      why:'Sol-Silikat enthält zusätzlich Kieselsol.'
    },
    'Tabelle · Methylcellulose · Chemische Erhärtung = ?':{
      prompt:'Welche chemische Erhärtung findet bei Methylcellulose statt?',
      options:['Keine; sie trocknet physikalisch.','Oxidation durch Sauerstoffaufnahme','Verkieselung mit mineralischen Untergründen','Hydraulisches Abbinden'],
      why:'Methylcellulose trocknet durch Wasserverdunstung und weist keine chemische Erhärtung auf.'
    },
    'Tabelle · Kunststoffdispersion · Physikalische Trocknung enthält welchen Fachbegriff?':{
      prompt:'Welcher Fachbegriff beschreibt die Filmbildung einer Kunststoffdispersion nach dem Verdunsten des Wassers?',
      options:['Kalter Fluss','Carbonatisierung','Verkieselung','Oxidation'],
      why:'Die Kunststoffteilchen rücken zusammen und bilden durch kalten Fluss einen zusammenhängenden Film.'
    },
    'Tabelle · Alkydharz · Ungeeigneter Spezialuntergrund = ?':{
      prompt:'Welcher Untergrund ist für den direkten Auftrag eines klassischen Alkydharzlacks besonders kritisch?',
      options:['Zink','Stahl mit geeigneter Grundbeschichtung','Holz bei passendem Systemaufbau','Neutraler Altputz bei geeignetem System'],
      why:'Klassische Alkydharzlacke sollen nicht direkt auf Zink eingesetzt werden; erforderlich ist ein dafür geeigneter Systemaufbau.'
    },
    'Tabelle · Nitrolack · Reversibel = ?':{
      prompt:'Wie ist ein physikalisch getrockneter Nitrolack hinsichtlich Reversibilität einzuordnen?',
      options:['Mit geeignetem Nitro-Lösemittel wieder anlösend','Nach dem Trocknen grundsätzlich chemisch irreversibel','Mit Wasser vollständig reversibel','Nur durch CO₂-Aufnahme reversibel'],
      why:'Nitrolack trocknet physikalisch und kann mit einem geeigneten Nitro-Lösemittel wieder angelöst werden.'
    },
    'Tabelle · Bitumen · Bindemittelherkunft = ?':{
      prompt:'Woher stammt Bitumen als Bindemittel?',
      options:['Aus Rückständen der Erdöldestillation','Aus Flachsamen','Aus Milcheiweiß','Aus Quarzsand und Pottasche'],
      why:'Bitumen ist ein Rückstand der Erdöldestillation.'
    },
    'Tabelle · Naturöle · Chemische Erhärtung = ?':{
      prompt:'Wie erhärten trocknende Naturöle wie Leinöl chemisch?',
      options:['Durch Oxidation','Durch Verkieselung','Durch hydraulisches Abbinden','Durch Carbonatisierung'],
      why:'Trocknende Öle nehmen Sauerstoff auf und erhärten durch Oxidation.'
    },
    'Tabelle · Silikonharzmikroemulsion · Bindemittelanteile = ?':{
      prompt:'Welche Kombination beschreibt den Bindemittelaufbau einer Silikonharzmikroemulsion am besten?',
      options:['Silikonharz plus Kunststoffdispersion','Silikonharz plus Kieselsol ohne Kunststoffdispersion','Kaliwasserglas plus Farbpulver','Alkydharz plus Nitrocellulose'],
      why:'Die Silikonharzmikroemulsion ist ein Mischsystem aus Silikonharz und Kunststoffdispersion.'
    },
    'Tabelle · Silikonharz · besondere Kerneigenschaft = ?':{
      prompt:'Welche Eigenschaftskombination ist für Silikonharz besonders kennzeichnend?',
      options:['Hohe Diffusionsfähigkeit und starke Wasserabweisung','Wasserreversibilität und geringe Witterungsbeständigkeit','Hydraulisches Abbinden und hohe Wasseraufnahme','Schnelle Nitro-Lösemittel-Reversibilität'],
      why:'Silikonharz verbindet hohe Diffusionsfähigkeit mit starker Wasserabweisung.'
    }
  };

  function injectStyle(){
    if(document.getElementById('binder-v201-style'))return;
    var s=document.createElement('style');
    s.id='binder-v201-style';
    s.textContent='.btStageTitle,.btStageSub{display:block!important}.btStageSub{margin-top:4px!important}.btSource{display:none!important}.btLauncherGroup .v17ActionGrid{grid-template-columns:1fr!important}.btLauncherGroup{margin-top:0}';
    document.head.appendChild(s);
  }

  function patchProfiles(){
    var api=window.FachteilBinderTrainerV20;
    if(!api||!Array.isArray(api.profiles))return;
    api.profiles.forEach(function(p){
      ['binder','solvent','diluent','physical','chemical','reversible','suitable','unsuitable','properties','core','simple','note'].forEach(function(k){if(p[k])p[k]=cleanText(p[k]);});
      p.source='';
      if(p.id==='zement')p.unsuitable='Metall, Holz und Kunststoff; außerdem Beton (zu diffusionsoffen), Gips (chemische Wechselwirkung) und Porenbeton (Wärmedämmung geht verloren).';
      if(p.id==='reinsilikat')p.note='Für das Prüfungstraining wird Metall einschließlich Zink nicht als geeigneter Direktuntergrund für Reinsilikat behandelt.';
      if(p.id==='solsilikat')p.simple='Der Kieselsol-Anteil verbessert Haftung auf organischen Untergründen und die Festigung.';
      if(p.id==='kunststoffdispersion'&&p.solvent)p.solvent=p.solvent.replace(/\s*\([^)]*fachlichen Grundlage[^)]*\)/gi,'').trim();
    });
  }

  function moveLauncher(){
    var dash=document.getElementById('v17Dashboard'),section=$('.btLauncherGroup',dash);
    if(!dash||!section)return;
    var head=$('.v17GroupTitle',section),hint=$('.v17GroupHint',section);
    if(head)head.textContent='Vertiefen';
    if(hint)hint.textContent='Thema wirklich verstehen';
    var groups=Array.prototype.slice.call(dash.children).filter(function(g){return g.classList&&g.classList.contains('v17Group');}),train=null;
    groups.forEach(function(g){var t=$('.v17GroupTitle',g);if(t&&t.textContent.trim()==='Trainieren')train=g;});
    if(train&&train.nextSibling!==section)dash.insertBefore(section,train.nextSibling);
  }

  function patchStageCopy(root){
    $all('.btStageTitle',root).forEach(function(el){if(el.textContent.trim()==='Tabellenmeister')el.textContent='Prüfungssicherheit';});
    $all('.btStageSub',root).forEach(function(el){if(el.textContent.indexOf('Originalstruktur')!==-1)el.textContent='Fachwissen sicher ohne Vorlage anwenden';});
    $all('.btStageHeaderTitle',root).forEach(function(el){if(el.textContent.trim()==='Tabellenmeister')el.textContent='Prüfungssicherheit';});
    $all('.btStageHeaderSub',root).forEach(function(el){if(el.textContent.indexOf('Originalstruktur')!==-1)el.textContent='Fachwissen sicher ohne Vorlage anwenden';});
  }

  function patchProfileView(root){
    var name=$('.btProfileName',root);if(!name)return;
    if(name.textContent.trim()==='Reinsilikat'){
      var n=$('.btNote',root),html='<strong>Achtung / Ausnahme:</strong> Für das Prüfungstraining wird Metall einschließlich Zink nicht als geeigneter Direktuntergrund für Reinsilikat behandelt.';if(n&&n.innerHTML!==html)n.innerHTML=html;
    }
  }

  function findPatchForQuestion(el){
    if(!el)return null;
    var key=el.dataset.v201Original;
    if(key&&PATCHES[key])return {key:key,p:PATCHES[key]};
    var txt=el.textContent.trim();
    if(PATCHES[txt]){el.dataset.v201Original=txt;return {key:txt,p:PATCHES[txt]};}
    var hit=null;
    Object.keys(PATCHES).some(function(k){if(PATCHES[k].prompt===txt){hit={key:k,p:PATCHES[k]};el.dataset.v201Original=k;return true;}return false;});
    return hit;
  }

  function patchQuiz(root){
    var qel=$('.btQuestion',root),found=findPatchForQuestion(qel);
    if(!qel)return;
    if(found){
      var p=found.p;if(qel.textContent!==p.prompt)qel.textContent=p.prompt;
      $all('.btAnswer',root).forEach(function(btn){
        var idx=Number(btn.dataset.orig),spans=btn.querySelectorAll('span');
        if(spans.length>1&&p.options&&p.options[idx]!=null&&spans[1].textContent!==p.options[idx])spans[1].textContent=p.options[idx];
      });
      var why=$('.btWhy',root);
      if(why&&p.why){var whyHtml='<strong>Warum?</strong><br>'+esc(p.why);if(why.innerHTML!==whyHtml)why.innerHTML=whyHtml;}
      var fb=$('.btFeedback.bad',root);
      if(fb&&p.options){
        var strong=fb.querySelector('strong'),node=strong&&strong.nextSibling;
        if(node&&node.nodeType===3){var wanted=' Die richtige Antwort ist: '+p.options[0];if(node.nodeValue!==wanted)node.nodeValue=wanted;}
      }
    }else{
      var cleanedQ=cleanText(qel.textContent);if(qel.textContent!==cleanedQ)qel.textContent=cleanedQ;
      var why2=$('.btWhy',root);if(why2){var st=why2.querySelector('strong');var text=why2.textContent.replace(/^Warum\?\s*/,'');why2.innerHTML='<strong>Warum?</strong><br>'+esc(cleanText(text));}
    }
  }

  function cleanVisibleText(root){
    if(!root)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentElement;if(!p)return NodeFilter.FILTER_REJECT;
      if(p.closest('.btSource'))return NodeFilter.FILTER_REJECT;
      if(p.closest('.btQuestion')||p.closest('.btAnswers')||p.closest('.btWhy'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    var nodes=[],n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(function(x){var c=cleanText(x.nodeValue);if(c!==x.nodeValue.trim())x.nodeValue=(/^\s/.test(x.nodeValue)?' ':'')+c+(/\s$/.test(x.nodeValue)?' ':'');});
  }

  function apply(){
    injectStyle();patchProfiles();moveLauncher();
    var root=document.getElementById('binderTrainer');
    if(root){patchStageCopy(root);patchProfileView(root);patchQuiz(root);cleanVisibleText(root);}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  var tries=0,t=setInterval(function(){tries++;apply();if(tries>80)clearInterval(t);},125);
  var observer=new MutationObserver(function(){apply();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
