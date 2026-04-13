<?php
/**
 * Template Part: Member Photo Gallery
 *
 * Displays a photo gallery for family members.
 * This template is included in single-family_member.php
 *
 * @package Chapaneri_Heritage
 */

if (!defined('ABSPATH')) {
    exit;
}

$member_id = get_the_ID();

// Get gallery images from post meta
$gallery_ids = get_post_meta($member_id, '_member_gallery', true);
$gallery_images = array();

// Add featured image as first gallery item
if (has_post_thumbnail($member_id)) {
    $gallery_images[] = array(
        'id'      => get_post_thumbnail_id($member_id),
        'url'     => get_the_post_thumbnail_url($member_id, 'large'),
        'thumb'   => get_the_post_thumbnail_url($member_id, 'medium'),
        'alt'     => get_the_title(),
        'caption' => __('Profile Photo', 'chapaneri-heritage'),
    );
}

// Add gallery images
if (!empty($gallery_ids) && is_array($gallery_ids)) {
    foreach ($gallery_ids as $image_id) {
        $image_url = wp_get_attachment_image_url($image_id, 'large');
        $thumb_url = wp_get_attachment_image_url($image_id, 'medium');
        $alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
        $caption = wp_get_attachment_caption($image_id);
        
        if ($image_url) {
            $gallery_images[] = array(
                'id'      => $image_id,
                'url'     => $image_url,
                'thumb'   => $thumb_url,
                'alt'     => $alt ?: get_the_title(),
                'caption' => $caption,
            );
        }
    }
}

// Only show gallery if there are images
if (empty($gallery_images)) {
    return;
}

$image_count = count($gallery_images);
?>

<div class="member-gallery heritage-card">
    <h3 class="gallery-title font-display">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <?php esc_html_e('Photo Gallery', 'chapaneri-heritage'); ?>
        <span class="gallery-count"><?php echo esc_html($image_count); ?></span>
    </h3>
    
    <div class="gallery-container">
        <!-- Main Display Image -->
        <div class="gallery-main">
            <button class="gallery-nav gallery-nav--prev" aria-label="<?php esc_attr_e('Previous image', 'chapaneri-heritage'); ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            
            <figure class="gallery-image-wrapper">
                <img 
                    id="gallery-main-image"
                    src="<?php echo esc_url($gallery_images[0]['url']); ?>" 
                    alt="<?php echo esc_attr($gallery_images[0]['alt']); ?>"
                    class="gallery-main-image"
                >
                <?php if (!empty($gallery_images[0]['caption'])) : ?>
                    <figcaption id="gallery-caption" class="gallery-caption">
                        <?php echo esc_html($gallery_images[0]['caption']); ?>
                    </figcaption>
                <?php else : ?>
                    <figcaption id="gallery-caption" class="gallery-caption" style="display: none;"></figcaption>
                <?php endif; ?>
            </figure>
            
            <button class="gallery-nav gallery-nav--next" aria-label="<?php esc_attr_e('Next image', 'chapaneri-heritage'); ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
            
            <!-- Image Counter -->
            <div class="gallery-counter">
                <span id="gallery-current">1</span> / <span id="gallery-total"><?php echo esc_html($image_count); ?></span>
            </div>
        </div>
        
        <!-- Thumbnail Strip -->
        <?php if ($image_count > 1) : ?>
            <div class="gallery-thumbnails">
                <?php foreach ($gallery_images as $index => $image) : ?>
                    <button 
                        class="gallery-thumb <?php echo $index === 0 ? 'active' : ''; ?>"
                        data-index="<?php echo esc_attr($index); ?>"
                        data-url="<?php echo esc_url($image['url']); ?>"
                        data-alt="<?php echo esc_attr($image['alt']); ?>"
                        data-caption="<?php echo esc_attr($image['caption']); ?>"
                        aria-label="<?php printf(esc_attr__('View image %d of %d', 'chapaneri-heritage'), $index + 1, $image_count); ?>"
                    >
                        <img src="<?php echo esc_url($image['thumb']); ?>" alt="">
                    </button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Lightbox -->
    <div class="gallery-lightbox" id="gallery-lightbox" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e('Image lightbox', 'chapaneri-heritage'); ?>">
        <button class="lightbox-close" aria-label="<?php esc_attr_e('Close lightbox', 'chapaneri-heritage'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        
        <button class="lightbox-nav lightbox-nav--prev" aria-label="<?php esc_attr_e('Previous image', 'chapaneri-heritage'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        
        <figure class="lightbox-content">
            <img id="lightbox-image" src="" alt="">
            <figcaption id="lightbox-caption" class="lightbox-caption"></figcaption>
        </figure>
        
        <button class="lightbox-nav lightbox-nav--next" aria-label="<?php esc_attr_e('Next image', 'chapaneri-heritage'); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    </div>
</div>

<script>
(function() {
    const gallery = document.querySelector('.member-gallery');
    if (!gallery) return;
    
    const mainImage = document.getElementById('gallery-main-image');
    const caption = document.getElementById('gallery-caption');
    const currentSpan = document.getElementById('gallery-current');
    const thumbnails = gallery.querySelectorAll('.gallery-thumb');
    const prevBtn = gallery.querySelector('.gallery-nav--prev');
    const nextBtn = gallery.querySelector('.gallery-nav--next');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = gallery.querySelector('.lightbox-close');
    const lightboxPrev = gallery.querySelector('.lightbox-nav--prev');
    const lightboxNext = gallery.querySelector('.lightbox-nav--next');
    
    const images = Array.from(thumbnails).map(thumb => ({
        url: thumb.dataset.url,
        alt: thumb.dataset.alt,
        caption: thumb.dataset.caption
    }));
    
    let currentIndex = 0;
    const totalImages = images.length;
    
    function updateDisplay(index) {
        currentIndex = index;
        mainImage.src = images[index].url;
        mainImage.alt = images[index].alt;
        
        if (images[index].caption) {
            caption.textContent = images[index].caption;
            caption.style.display = 'block';
        } else {
            caption.style.display = 'none';
        }
        
        if (currentSpan) {
            currentSpan.textContent = index + 1;
        }
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    function showPrev() {
        updateDisplay((currentIndex - 1 + totalImages) % totalImages);
    }
    
    function showNext() {
        updateDisplay((currentIndex + 1) % totalImages);
    }
    
    function openLightbox() {
        lightboxImage.src = images[currentIndex].url;
        lightboxImage.alt = images[currentIndex].alt;
        lightboxCaption.textContent = images[currentIndex].caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightbox() {
        lightboxImage.src = images[currentIndex].url;
        lightboxImage.alt = images[currentIndex].alt;
        lightboxCaption.textContent = images[currentIndex].caption || '';
    }
    
    // Event listeners
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateDisplay(index));
    });
    
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    
    mainImage.addEventListener('click', openLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxPrev.addEventListener('click', () => {
        showPrev();
        updateLightbox();
    });
    
    lightboxNext.addEventListener('click', () => {
        showNext();
        updateLightbox();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            showPrev();
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            showNext();
            updateLightbox();
        }
    });
})();
</script>
