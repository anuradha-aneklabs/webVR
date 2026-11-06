import cv2
import numpy as np

img = cv2.imread('public/assets/hero_clean.jpg')
h, w = img.shape[:2]

# Clean the top navbar pill and Scan QR button baked into the top sky:
# y: 0 to 45, x from 300 to 1024
top_mask = np.zeros((h, w), dtype=np.uint8)

# Center nav pill area: y: 8 to 44, x: 310 to 660
top_mask[8:44, 310:660] = 255

# Right Scan QR button: y: 8 to 44, x: 920 to 1000
top_mask[8:44, 920:1000] = 255

# Dilate mask
kernel = np.ones((5, 5), np.uint8)
top_mask = cv2.dilate(top_mask, kernel, iterations=1)

# Inpaint top sky and mountain ridge
cleaned_sky = cv2.inpaint(img, top_mask, 7, cv2.INPAINT_TELEA)

cv2.imwrite('public/assets/hero_clean.jpg', cleaned_sky)
print('Successfully cleaned top baked UI from hero_clean.jpg')

