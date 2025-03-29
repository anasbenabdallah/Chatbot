import re


KNOWN_CITIES = ["paris", "lyon", "marseille", "lille", "toulouse", "bordeaux"]

def parse_criteria(msg: str):
    msg = msg.lower()
    location = ""
    max_price = None

    for city in KNOWN_CITIES:
        if city in msg:
            location = city
            break

 
    price_match = re.search(r"(?:moins de|inférieur à|jusqu’à|maximum|max)?\s*(\d+)\s*(?:euros?|€)?", msg)
    if price_match:
        max_price = int(price_match.group(1))

    return {
        "location": location or "paris",
        "max_price": max_price
    }
