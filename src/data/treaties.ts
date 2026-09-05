import { Treaty, CausalityConnection } from '../types';

export const TREATIES: Treaty[] = [
  {
    id: 'karlofca',
    title: 'Karlofça Antlaşması',
    year: 1699,
    dateStr: '26 Ocak 1699',
    sultan: 'II. Mustafa',
    sadrazam: 'Amcazade Hüseyin Paşa',
    parties: ['Osmanlı Devleti', 'Avusturya', 'Lehistan', 'Venedik'],
    locationName: 'Karlofça (Bugünkü Sırbistan)',
    mapCoords: { x: 34.1, y: 39.2 },
    contextNote: '16 yıl süren Kutsal İttifak Savaşları sonrasında İngiltere ve Hollanda elçilerinin arabuluculuğuyla imzalanmıştır.',
    criticalProvision: 'Antlaşma 25 yıl geçerli olacak ve barışın garantörü Avusturya Devleti olacaktır.',
    memoryTip: 'Batıda ilk kez büyük çapta toprak kaybedilmiş, savunma politikasına geçilerek yabancı arabuluculuk kabul edilmiştir.',
    keyHighlight: 'Batıda ilk kez büyük çapta toprak kaybedilmiş, Orta Avrupa hâkimiyeti sona ermiştir.',
    items: [
      {
        id: 'k-c1',
        text: 'II. Viyana Kuşatması sonrası kurulan Kutsal İttifak\'a karşı 16 yıl boyunca çok cepheli savaşlar yürütüldü.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Kutsal İttifak ile yapılan uzun savaşlar ve ordunun yıpranması barış sürecine zemin hazırlamıştır.'
      },
      {
        id: 'k-c2',
        text: '1697 Zenta Muharebesi\'nde Osmanlı ordusu müttefik kuvvetler karşısında ağır bir mağlubiyete uğradı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Zenta yenilgisi sonrası askeri imkânlar tükenmiş ve barış masasına oturulmuştur.'
      },
      {
        id: 'k-c3',
        text: 'Yıllar süren seferlerin hazineyi tüketmesi üzerine İngiltere ve Hollanda\'nın arabuluculuğu kabul edildi.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Çok cepheli yıpratıcı savaşlar ve mali güçlükler barış teklifini kabul ettirmiştir.'
      },
      {
        id: 'k-e1',
        text: 'Batıda ilk kez Macaristan, Erdel, Podolya, Ukrayna ve Mora gibi geniş topraklar düşman devletlere bırakıldı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Orta ve Doğu Avrupa’daki devasa coğrafyalar müttefik devletlere devredilmiştir.'
      },
      {
        id: 'k-e2',
        text: 'Orta Avrupa\'daki siyasi üstünlük kaybedildi ve mevcut sınırları koruma amaçlı savunma anlayışına geçildi.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Karlofça, Osmanlı dış politikasında taarruz devrini kapatıp savunma dönemini başlatmıştır.'
      },
      {
        id: 'k-e3',
        text: 'Antlaşmanın garantörlüğü 25 yıllık süre için ilk kez Avusturya Devleti\'ne verildi.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Osmanlı Devleti ilk kez bir antlaşmanın garantörlüğünü başka bir devlete devretmiştir.'
      }
    ]
  },
  {
    id: 'prut',
    title: 'Prut Antlaşması',
    year: 1711,
    dateStr: '21 Temmuz 1711',
    sultan: 'III. Ahmed',
    sadrazam: 'Baltacı Mehmed Paşa',
    parties: ['Osmanlı Devleti', 'Rus Çarlığı'],
    locationName: 'Prut Nehri Kıyısı (Boğdan / Moldavya)',
    mapCoords: { x: 54.8, y: 19.3 },
    contextNote: 'Prut Nehri kıyısında Rus ordusunun kuşatılması üzerine Çar I. Petro’nun barış teklifiyle imzalanmıştır.',
    criticalProvision: 'Azak Kalesi Osmanlı’ya geri verilecek; Rusya İstanbul’da elçi bulundurmayacaktır.',
    memoryTip: 'Kayıpları telafi politikasının ilk başarısıdır; Azak Kalesi geri alınmış ve Karadeniz güvenliği yeniden sağlanmıştır.',
    keyHighlight: 'Karlofça ile kaybedilen yerlerin geri alınabileceğine dair umut ve inanç yeniden güçlenmiştir.',
    items: [
      {
        id: 'p-c1',
        text: 'Karlofça ile kaybedilen yerleri ve Karadeniz güvenliği için hayati olan Azak Kalesi\'ni geri alma kararı alındı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Kaybedilen stratejik kaleleri geri alma arzusu Prut seferini başlatmıştır.'
      },
      {
        id: 'p-c2',
        text: 'Rus birlikleri İsveç Kralı\'nı takip etme gerekçesiyle Osmanlı topraklarına girerek sınır ihlali yaptı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Rus birliklerinin sınır ihlalleri savaşı başlatan doğrudan gelişme olmuştur.'
      },
      {
        id: 'p-c3',
        text: 'Poltava Muharebesi\'nde Rusya\'ya mağlup olan İsveç Kralı XII. Şarl Osmanlı Devleti\'ne sığındı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. İsveç Kralı\'nın Bender\'e sığınması Osmanlı-Rus diplomatik krizini tırmandırmıştır.'
      },
      {
        id: 'p-e1',
        text: 'Stratejik öneme sahip Azak Kalesi ve çevresi yeniden Osmanlı idaresine geçti.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Karadeniz’in kuzey güvenliği yeniden sağlanmış ve Rusya Karadeniz\'den uzaklaştırılmıştır.'
      },
      {
        id: 'p-e2',
        text: 'Rusya\'nın İstanbul\'daki daimi elçiliği kapatıldı ve kaybedilen toprakları geri alma inancı güçlendi.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Antlaşma, kaybedilen toprakların geri alınabileceğine dair güçlü bir moral kazandırmıştır.'
      },
      {
        id: 'p-e3',
        text: 'Prut Nehri kıyısında kuşatılan Rus ordusunun barış teklifiyle Karadeniz kıyılarında güvenlik sağlandı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Kuşatma neticesinde Rusya geri adım atmış ve diplomatik taahhütlerde bulunmuştur.'
      }
    ]
  },
  {
    id: 'pasarofca',
    title: 'Pasarofça Antlaşması',
    year: 1718,
    dateStr: '21 Temmuz 1718',
    sultan: 'III. Ahmed',
    sadrazam: 'Nevşehirli Damat İbrahim Paşa',
    parties: ['Osmanlı Devleti', 'Avusturya', 'Venedik'],
    locationName: 'Pasarofça (Požarevac / Sırbistan)',
    mapCoords: { x: 31.2, y: 30.4 },
    contextNote: 'İngiltere ve Hollanda’nın ara buluculuğuyla imzalanmış, ardından Osmanlı Devleti’nde Lale Devri başlamıştır.',
    criticalProvision: 'Belgrad ve Banat Avusturya’ya verilirken, Mora Yarımadası Osmanlı’da kalacaktır.',
    memoryTip: 'Avrupa\'nın askeri üstünlüğü kabul edilerek Batı tarzı ıslahatlar başlamış ve barışı koruma politikasına geçilmiştir.',
    keyHighlight: 'Batıdaki toprakları geri alma politikasından vazgeçilerek Avrupa ile barış ve ıslahat sürecine geçilmiştir.',
    items: [
      {
        id: 'ps-c1',
        text: 'Mora\'nın Venedik\'ten geri alınması üzerine Avusturya garantörlük sıfatını öne sürerek savaşa dahil oldu.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Mora\'daki başarı Avusturya’yı harekete geçirmiş ve savaşı iki cepheli hale getirmiştir.'
      },
      {
        id: 'ps-c2',
        text: 'Petervaradin Muharebesi\'nde ordu mağlup oldu ve Tuna savunmasının kilidi Belgrad Kalesi elden çıktı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Alınan ağır darbeler ve Tuna’nın ana kilidi Belgrad’ın düşmesi barışa zorlamıştır.'
      },
      {
        id: 'ps-c3',
        text: 'Venedik idaresinin baskısından bunalan Mora halkı Osmanlı Devleti\'nden askeri yardım talep etti.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Bölge halkının talepleri ve stratejik hedefler Mora Seferi\'ni başlatmıştır.'
      },
      {
        id: 'ps-e1',
        text: 'Belgrad, Temeşvar ve Banat yaylası Avusturya\'ya devredildi; Mora Yarımadası Osmanlı\'da kaldı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Mora kurtarılmış ancak Orta Avrupa’nın kapısı Belgrad yitirilmiştir.'
      },
      {
        id: 'ps-e2',
        text: 'Batıdaki toprak kayıplarını telafi etme siyaseti terk edildi ve barış odaklı Lale Devri başladı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Avrupa ile barışçıl diplomasiye geçilmiş ve Lale Devri süreci başlamıştır.'
      },
      {
        id: 'ps-e3',
        text: 'Avrupa\'nın askeri üstünlüğü kabul edilerek Batı tarzı ıslahat hareketlerine ve diplomasiye yönelindi.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Osmanlı Devleti Avrupa diplomasisini ve teknik gelişmelerini yakından izlemeye başlamıştır.'
      }
    ]
  },
  {
    id: 'belgrad',
    title: 'Belgrad Antlaşması',
    year: 1739,
    dateStr: '18-29 Eylül 1739',
    sultan: 'I. Mahmud',
    sadrazam: 'Hacı İvaz Mehmed Paşa',
    parties: ['Osmanlı Devleti', 'Avusturya', 'Rusya'],
    locationName: 'Belgrad Kalesi',
    mapCoords: { x: 35.0, y: 32.9 },
    contextNote: 'Fransa’nın diplomatik ara buluculuğuyla imzalanmış; Fransa’ya 1740’ta kapitülasyonların sürekli hale getirilmesi hakkı tanınmıştır.',
    criticalProvision: 'Belgrad Osmanlı’ya iade edilecek; Rusya Karadeniz’de savaş ve ticaret gemisi bulunduramayacaktır.',
    memoryTip: '18. yüzyılda Batı’da imzalanan son kazançlı antlaşmadır; Tuna savunma hattı ve Karadeniz’in Türk gölü statüsü korunmuştur.',
    keyHighlight: '18. yüzyılda Osmanlı Devleti’nin Batı’da imzaladığı son kazançlı antlaşmadır.',
    items: [
      {
        id: 'b-c1',
        text: 'Osmanlı yönetimi, Pasarofça ile yitirilen stratejik Belgrad\'ı ve Tuna savunma hattını geri almayı kararlaştırdı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Belgrad’ın kaybı Balkanlar ve İstanbul için büyük bir stratejik tehlike oluşturuyordu.'
      },
      {
        id: 'b-c2',
        text: 'Avusturya ve Rusya gizli ittifak protokolü imzalayarak Osmanlı sınırlarına iki ayrı cepheden saldırdı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. İki müttefik devletin eş zamanlı saldırıları Osmanlıyı topyekûn savunmaya yöneltmiştir.'
      },
      {
        id: 'b-c3',
        text: 'Humbaracı Ahmed Paşa öncülüğünde yapılan askeri yeniliklerle topçu ve humbaracı ocakları güçlendirildi.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Askeri teşkilatta ve topçu sınıfında yapılan yenilikler iki cephede zafer kazandırmıştır.'
      },
      {
        id: 'b-e1',
        text: 'Belgrad ve Semendire kaleleri yeniden fethedilerek Tuna savunma hattı baştan kuruldu.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Ordu iki cephede birden başarı kazanmış ve kaybedilen kaleleri kurtarmıştır.'
      },
      {
        id: 'b-e2',
        text: 'Rusya\'nın Karadeniz\'de gemi bulundurması yasaklandı ve Avusturya ile uzun vadeli barış sağlandı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Karadeniz’in güvenliği korunmuş ve uzun süreli diplomatik istikrar sağlanmıştır.'
      },
      {
        id: 'b-e3',
        text: 'Fransa\'nın barış sürecindeki arabuluculuğuna karşılık verilen ticari kapitülasyonlar daimi kılındı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Fransız arabuluculuğuna karşılık ticari ayrıcalıklar daimi hale getirilmiştir.'
      }
    ]
  },
  {
    id: 'kucuk_kaynarca',
    title: 'Küçük Kaynarca Antlaşması',
    year: 1774,
    dateStr: '21 Temmuz 1774',
    sultan: 'I. Abdülhamid',
    sadrazam: 'Muhsinzade Mehmed Paşa',
    parties: ['Osmanlı Devleti', 'Rus Çarlığı'],
    locationName: 'Küçük Kaynarca (Silistre Yakınları / Dobruca)',
    mapCoords: { x: 50.2, y: 30.6 },
    contextNote: '1768-1774 savaşı sonucunda imzalanmış; Ruslar antlaşma tarihini özellikle Prut’un yıl dönümü olan 21 Temmuz’a denk getirmiştir.',
    criticalProvision: 'Kırım bağımsız olacak; Rusya ilk kez kapitülasyon ve savaş tazminatı hakkı elde edecektir.',
    memoryTip: 'Halkı Müslüman ve Türk olan Kırım kaybedilmiş, Karadeniz Türk gölü olmaktan çıkmış ve ilk kez savaş tazminatı ödenmiştir.',
    keyHighlight: 'Halkı Müslüman ve Türk olan bir toprak parçası (Kırım) ilk kez kaybedilmiştir.',
    items: [
      {
        id: 'kk-c1',
        text: 'Rusya\'nın Lehistan\'a askeri müdahalede bulunması ve kaçan Lehleri takip bahanesiyle Osmanlı sınır karakolları ihlal edildi.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Rus birliklerinin sınır ihlalleri savaşı başlatan temel gelişme olmuştur.'
      },
      {
        id: 'kk-c2',
        text: '1770 Çeşme Limanı baskınında Osmanlı donanması yakıldı ve Kartal Sahrası\'nda büyük bir hezimet yaşandı.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Hem denizde hem karada yaşanan hezimetler Osmanlı direncini kırmıştır.'
      },
      {
        id: 'kk-c3',
        text: 'Balkanlar\'a kadar inen Rus ordusu karşısında 1774 Kozluca Muharebesi kaybedildi.',
        type: 'cause',
        explanation: 'Doğru değerlendirme. Kozluca yenilgisi Osmanlıyı antlaşmayı ağır şartlarla kabule zorlamıştır.'
      },
      {
        id: 'kk-e1',
        text: 'Kırım Hanlığı bağımsız kılındı; halkı Müslüman bir coğrafyayla kültürel bağı korumak için halifelik makamı kullanıldı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Kırım siyasi olarak ayrılmış; dini-kültürel bağı korumak için halifelik maddesi eklenmiştir.'
      },
      {
        id: 'kk-e2',
        text: 'Rus ticaret gemilerine Boğazlar\'dan serbest geçiş hakkı ve Ortodoks tebaayı himaye imtiyazı tanındı.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Rusya Boğazlar\'dan serbest geçiş ve konsolosluklar açarak iç siyasete müdahale gücü elde etti.'
      },
      {
        id: 'kk-e3',
        text: 'Osmanlı Devleti savaş tarihinde ilk defa yabancı bir devlete savaş tazminatı ödemeyi kabul etti.',
        type: 'effect',
        explanation: 'Doğru değerlendirme. Ağır mali ve ticari yük getiren bu maddeler devleti ekonomik yönden yıpratmıştır.'
      }
    ]
  }
];

export const CAUSALITY_CONNECTIONS: CausalityConnection[] = [
  {
    fromTreatyId: 'karlofca',
    toTreatyId: 'prut',
    previousConsequence: 'Karlofça ile batıda ve kuzeyde uğranılan devasa toprak kayıpları ve Orta Avrupa üstünlüğünün sona ermesi',
    nextCause: 'Devlet ricalinde ve orduda kaybedilen toprakları geri alma arzusunun doğması ve Azak Kalesi’nin geri alınması hedefi',
    transitionNote: 'Karlofça’nın yarattığı derin kayıp duygusu, Osmanlı Devleti’nin 18. yüzyıl başındaki dış politikasını bütünüyle "kayıpları geri alma" çizgisine taşımıştır.'
  },
  {
    fromTreatyId: 'prut',
    toTreatyId: 'pasarofca',
    previousConsequence: 'Prut’ta Rus ordusunun kuşatılarak Azak Kalesi’nin geri alınması ve kazanılan psikolojik üstünlük',
    nextCause: 'Bu başarının verdiği cesaretle Karlofça ile Venedik’e bırakılmış olan Mora’nın geri alınması ve Avusturya’nın savaşa girmesi',
    transitionNote: 'Prut zaferi kaybedilen diğer yerlerin de kurtarılabileceği umudunu ateşlemiş, ancak Venedik’e karşı elde edilen başarı Avusturya’nın müdahalesini tetiklemiştir.'
  },
  {
    fromTreatyId: 'pasarofca',
    toTreatyId: 'belgrad',
    previousConsequence: 'Pasarofça ile Belgrad ve Kuzey Sırbistan’ın kaybedilmesi; Tuna savunma hattının çökmesi',
    nextCause: 'Balkanlar’ın ve İstanbul’un güvenliği için hayati olan Belgrad’ı geri alarak Tuna hattını yeniden tesis etme zorunluluğu',
    transitionNote: 'Pasarofça’da verilen en ağır kayıp olan Belgrad, yirmi yıl sonra I. Mahmud dönemindeki askeri reformlar ve başarılı seferlerle yeniden kurtarılmıştır.'
  },
  {
    fromTreatyId: 'belgrad',
    toTreatyId: 'kucuk_kaynarca',
    previousConsequence: 'Belgrad Antlaşması ile Avusturya karşısında sağlanan 50 yıllık barış ve Rusya’nın Karadeniz’de donanma bulunduramaması',
    nextCause: 'Çariçe II. Katerina’nın sıcak denizlere inme planlarını hızlandırması, Lehistan’a müdahalesi ve 50 yıllık barışın Osmanlı ordusunda rehavet yaratması',
    transitionNote: 'Belgrad sonrasında yaşanan uzun süreli sükûnet ortamı Osmanlı ordusunda teknik ve lojistik gerilemeye yol açmış; 1768’de başlayan yeni Rus saldırısı hazırlıksız karşılanmıştır.'
  }
];

export const DIPLOMATIC_STAGES = [
  {
    title: '1. Aşama: Taarruzdan Savunmaya Geçiş (1699)',
    desc: 'Karlofça ile Osmanlı Devleti batıda ilk kez toprak kaybetmiş, fetih siyasetinin yerini sınırları koruma anlayışı almıştır.'
  },
  {
    title: '2. Aşama: Kayıpları Telafi Etme Çabası (1711 - 1718)',
    desc: 'Prut ile Azak geri alınarak umut tazelenmiş; ancak Pasarofça’da Belgrad’ın kaybıyla batıdaki üstünlük arayışı son bulmuştur.'
  },
  {
    title: '3. Aşama: Mevcut Gücü Koruma ve Son Kazanç (1739)',
    desc: 'Belgrad Antlaşması ile Tuna savunma hattı yeniden güvenceye alınmış ve 18. yüzyılın son büyük diplomatik başarısı elde edilmiştir.'
  },
  {
    title: '4. Aşama: Varlık Mücadelesi ve Ağır Şartlar (1774)',
    desc: 'Küçük Kaynarca ile Kırım yitirilmiş, Karadeniz hakimiyeti kırılmış ve devlet varlığını koruma amaçlı bir döneme girmiştir.'
  }
];
