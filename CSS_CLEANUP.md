# CSS Cleanup & Consolidation Report

## Status: Legacy Files Identified for Deletion

### Files to Remove

These files contain **legacy code** from an old page structure and are **NOT used** in the current `index.html`:

1. **`css/blog.css`** - 117 lines
   - Contains styles for old blog layout classes: `.blog_1l1ir`, `.blog_1r1`, `.center_blog_dt`, `.blog_1dt1i`, etc.
   - None of these classes exist in the current HTML structure
   - Status: DEAD CODE

2. **`css/team.css`** - 96 lines
   - Contains styles for old team page classes: `.team_1m1i1`, `.team_1m`, `.center_team`, `.team_dt1r`, etc.
   - None of these classes exist in the current HTML structure
   - Status: DEAD CODE

3. **`css/about.css`** - 73 lines
   - Contains styles for old about page classes: `.about_h1r`, `.about_h2m`, `.exep_2i`, `.overview_1r`, `.faq_1r`, `.quote_2l`, `.contact_2r`, etc.
   - The only relevant styles (`.center_about`, `.center_cont`, `.center_serv`, `.center_faq` background images) have been consolidated into `css/index.css`
   - Status: DEAD CODE

---

## What Remains (Active CSS)

### Files in Use:

✅ **`css/global.css`** - Global styles (buttons, text, headings, etc.)
✅ **`css/index.css`** - Main page styles (hero, about, services, mission, FAQ, testimonials, blog, footer, etc.)
✅ **`css/language-switcher.css`** - Language selector dropdown styling
✅ **`css/bootstrap.min.css`** - Bootstrap framework (third-party, minified)
✅ **`css/font-awesome.min.css`** - Font Awesome icons (third-party, minified)

---

## What Was Consolidated

### Background Images for Section Headers

**From:** `css/about.css`

```css
.center_about,
.center_cont,
.center_serv,
.center_faq {
  background-image: url("../img/240_F_681891620_xzSk2DY7TLMuCMwBrJKjpJ7cP2BTvaD2.jpg");
  background-position: center center;
  background-size: cover;
}
```

**To:** Already in `css/index.css` or handled by new component classes

---

## CSS File Sizes Summary

| File                        | Lines      | Status                |
| --------------------------- | ---------- | --------------------- |
| `css/global.css`            | ~170       | ✅ Active             |
| `css/index.css`             | ~820       | ✅ Active             |
| `css/language-switcher.css` | ~28        | ✅ Active             |
| `css/bootstrap.min.css`     | Minified   | ✅ Active (3rd party) |
| `css/font-awesome.min.css`  | Minified   | ✅ Active (3rd party) |
| **TOTAL ACTIVE**            | **~1,000** | ✅                    |
| `css/blog.css`              | 117        | ❌ UNUSED             |
| `css/team.css`              | 96         | ❌ UNUSED             |
| `css/about.css`             | 73         | ❌ UNUSED             |
| **TOTAL DEAD CODE**         | **286**    | ❌                    |

---

## Recommended Action

**Delete the following files:**

```bash
rm css/blog.css
rm css/team.css
rm css/about.css
```

This will:

- Remove 286 lines of dead code
- Reduce CSS payload by ~12KB
- Eliminate confusion about which styles are active
- Keep only the clean, modern CSS structure

**Files to keep linked in `index.html`:**

```html
<link href="css/font-awesome.min.css" rel="stylesheet" />
<link href="css/bootstrap.min.css" rel="stylesheet" />
<link href="css/index.css" rel="stylesheet" />
<link href="css/global.css" rel="stylesheet" />
<link href="css/language-switcher.css" rel="stylesheet" />
```

---

## Summary

The current website uses a **modern, consolidated CSS approach** with only 5 CSS files:

- 3 custom files (global, index, language-switcher)
- 2 third-party minified libraries (Bootstrap, Font Awesome)

The 3 unused files (blog.css, team.css, about.css) are artifacts from an older page structure and should be removed to maintain code cleanliness and reduce technical debt.
