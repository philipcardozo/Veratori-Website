import cv2
cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)  # mac-friendly backend
if not cap.isOpened(): raise IOError("Cannot open webcam")
while True:
    ok, frame = cap.read()
    if not ok: break
    cv2.imshow("Mac Camera Preview", frame)
    k = cv2.waitKey(1) & 0xFF
    if k in (27, ord('q')): break  # ESC or q
cap.release(); cv2.destroyAllWindows()
