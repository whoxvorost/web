from requests import get
import chardet


def headers_from_str(headers_str: str) -> dict[str, str]:
    headers = {}
    for header_str in headers_str.split("\n"):
        print(header_str)
        header, value = header_str.split(": ")
        headers[header] = value
    return headers


text = """Жили собі дід та баба, та такі убогі, що нічого в них не було. Одного разу дід і каже:

– Бабусю! Піди у хижку та назмітай у засіці борошна, та спечи мені колобок.

Баба так і зробила. Спекла колобок і залишила на вікні, щоб простиг. А він з вікна та на призьбу, а з призьби та на землю, та й покотився дорогою.

Котиться, котиться, а назустріч йому зайчик-побігайчик:

– Колобок, колобок, я тебе з’їм!

– Не їж мене, зайчику-побігайчику, я тобі пісню заспіваю.

– Ану, якої?

Я по коробу метений, На яйцях спечений, Я від баби втік, я від діда втік, І від тебе втечу!"""

headers_text = """User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0
Accept: */*
Accept-Language: uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Content-Length: 1048
Referer: https://neuralwriter.com/uk/summarize-tool/
Origin: https://neuralwriter.com
Connection: keep-alive
Cookie: _ga_0H9B3GKW0S=GS1.1.1728935255.3.1.1728937191.43.0.199978650; _ga=GA1.1.456357052.1728929922; __gads=ID=10f30819f781400a:T=1728929922:RT=1728937018:S=ALNI_MYXrbGneS9nsqftKBR-a4RR6Gl0dw; __gpi=UID=00000f08e0520545:T=1728929922:RT=1728937018:S=ALNI_Maj7oE3cjgbTnsLWedSjFaD-CngeQ; __eoi=ID=2867398a60b3d195:T=1728929922:RT=1728937018:S=AA-AfjZ2JQKO8DXDGNC58lQeUdhQ; FCNEC=%5B%5B%22AKsRol9Nw-4R9D8a7R6u2hpw2CiA3GHuxC8TpL3TrkXBDljPB_J8eDYgoWxunfRPnpxcU6948H2DQn2zNKfk9gITgzR9raCpm2tftGo0eVZ6h7og2xeRM30Rowd_xapOZchxYbAmHcdB7B5ZnfwTOdwLQzYQfFYzSw%3D%3D%22%5D%5D
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
TE: trailers"""

url = "https://neuralwriter.com/api/summarize/"
headers = headers_from_str(headers_text)
body = {
    "text": text,
    "size": 90,
    "from": "uk"
}

response = get(url, headers=headers, json=body)



result = chardet.detect(response.content)

print(result)
