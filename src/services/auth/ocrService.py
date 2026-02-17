'''
여기 한글 출력이 안 됨.
서버에서도 안 되는지는 모름.
되도록 영어로 출력
'''

import sys
import argparse
import json
import easyocr

sys.stdout.reconfigure(encoding='utf-8')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--userId")
    args = parser.parse_args()

    # OCR 초기 설정
    reader = easyocr.Reader(['en', 'ko'], gpu=False)
    path = f"src/services/auth/uploads/{args.userId}.PNG"
    results = reader.readtext(path)

    output = []
    for (bbox, text, prob) in results:
        text = text.strip()
        text = text.replace(' ', '')
        text += f" (reliability: {prob:.2f})"
        output.append(text)
    print(json.dumps(output, ensure_ascii=False))

if __name__ == "__main__":
    main()

    # 인식률 에반데