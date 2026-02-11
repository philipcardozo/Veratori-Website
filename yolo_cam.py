from ultralytics import YOLO
model = YOLO("yolov8n.pt")  # swap with your custom .pt when ready
model.predict(source=0, show=True)  # 0 = Mac webcam
