import cv2
import numpy as np

img = cv2.imread('public/assets/hero_bg.jpg') # Read from original hero_bg to avoid compounding
h, w = img.shape[:2]

# The Park Overview card sits at x: 864 to 1018, y: 46 to 264
x1, x2 = 864, 1018
y1, y2 = 46, 264
card_w = x2 - x1
card_h = y2 - y1

mask = np.zeros((h, w), dtype=np.uint8)
# Cover card and its borders
mask[y1:y2, x1:x2] = 255
# Dilate mask slightly to cover shadows/glow
kernel = np.ones((5, 5), np.uint8)
mask = cv2.dilate(mask, kernel, iterations=1)

# Inpaint base with Telea
inpainted = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)

# Source lush forest trees from adjacent area (x from 710 to 710 + card_w)
src_x1 = 710
src_x2 = src_x1 + card_w
source_foliage = img[y1:y2, src_x1:src_x2].astype(np.float32)

inpainted_card = inpainted[y1:y2, x1:x2].astype(np.float32)

# Match color/brightness
foliage_matched = source_foliage.copy()
for c in range(3):
    target_mean = inpainted_card[:, :, c].mean()
    src_mean = max(1.0, source_foliage[:, :, c].mean())
    foliage_matched[:, :, c] = np.clip(source_foliage[:, :, c] * (target_mean / src_mean), 0, 255)

# Soft alpha mask
alpha = np.zeros((h, w), dtype=np.float32)
alpha[y1+4:y2-4, x1+4:x2-4] = 1.0
alpha = cv2.GaussianBlur(alpha, (25, 25), 0)

# Blend texture with inpaint
blended_card = inpainted_card * 0.4 + foliage_matched * 0.6

result = inpainted.copy().astype(np.float32)
result[y1:y2, x1:x2] = blended_card

final = img.astype(np.float32) * (1.0 - alpha[:, :, None]) + result * alpha[:, :, None]
final = np.clip(final, 0, 255).astype(np.uint8)

cv2.imwrite('public/assets/hero_clean.jpg', final)
print('Successfully removed Park Overview card and saved to public/assets/hero_clean.jpg')
