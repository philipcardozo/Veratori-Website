import time, random

start = time.time()
while time.time() - start < 100:
    ms = random.uniform(50, 999)
    print(f"0: 384x640 1 bottle, 1 cup, 1 coke {ms:.1f}ms - expiration 3m, 29d, 23h")
    time.sleep(0.3)  # adjust speed of printing if you like
