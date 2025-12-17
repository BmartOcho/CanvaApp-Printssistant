# 🖨️ Printssistant MVP - 10-Day Launch Plan

**Target Launch:** December 22, 2025 (or before)  
**Created:** December 12, 2025  
**Author:** AI-assisted development with prepress domain expertise

---

## 🎯 MVP Core Value Proposition

**"The prepress assistant Canva users never knew they needed."**

Unlike generic design tools, Printssistant is built by a prepress operator with 8+ years of commercial printing experience. It catches the real issues that cause job rejections and reprints.

---

## 📋 MVP Feature Scope

### ✅ Phase 1: Polish & Foundation (Days 1-3)
- [ ] Redesign UI with professional, premium look
- [ ] Improve UX flow - progressive disclosure checklist
- [ ] Add more print job presets (A4, Postcard, Banner, etc.)
- [ ] Large format specific specs (vinyl banners, yard signs, etc.)
- [ ] Add prepress tips/education throughout the workflow
- [ ] Loading states and smooth transitions

### ✅ Phase 2: DPI Analyzer (Days 4-6)
- [ ] Image element detection on canvas
- [ ] DPI calculation based on image dimensions vs. placed size
- [ ] Visual indicator (green/yellow/red) for each image
- [ ] Large format DPI guidelines (viewing distance education)
- [ ] "Quick scan" button for instant design analysis
- [ ] Detailed report view with recommendations

### ✅ Phase 3: Advanced Checks (Days 7-8)
- [ ] Color space warnings (RGB vs CMYK education)
- [ ] Pure black detection (warn about using 100K vs rich black)
- [ ] Bleed verification helper
- [ ] Font/text safety zone checker
- [ ] Export recommendations based on job type

### ✅ Phase 4: Testing & Launch Prep (Days 9-10)
- [ ] End-to-end testing
- [ ] Error handling and edge cases
- [ ] Performance optimization
- [ ] Submission preparation
- [ ] Documentation for testers

---

## 🏗️ Technical Architecture

### New File Structure
```
src/
├── app.tsx                    # Main app (simplified)
├── index.tsx                  # Entry point
├── components/
│   ├── ChecklistItem.tsx      # Enhanced checklist item
│   ├── DPIAnalyzer.tsx        # NEW: Image analysis component
│   ├── JobSelector.tsx        # NEW: Print job selection
│   ├── PreflightChecklist.tsx # NEW: Main checklist view
│   ├── PreflightReport.tsx    # NEW: Analysis results
│   ├── QuickScan.tsx          # NEW: One-click analysis
│   └── Tips/
│       ├── DPITip.tsx         # Large format DPI education
│       ├── BleedTip.tsx       # Bleed explanations
│       └── ColorTip.tsx       # CMYK/RGB education
├── data/
│   ├── print_specs.ts         # Enhanced with more job types
│   └── dpi_guidelines.ts      # NEW: DPI recommendations
├── hooks/
│   ├── useDesignAnalysis.ts   # NEW: Analyze canvas elements
│   ├── usePreflightState.ts   # NEW: State management
│   └── useDPICalculator.ts    # NEW: DPI calculation logic
├── utils/
│   ├── dpi.ts                 # NEW: DPI calculation utilities
│   ├── colors.ts              # NEW: Color analysis utilities
│   └── format.ts              # NEW: Formatting helpers
└── styles/
    ├── app.css                # NEW: Premium app styles
    ├── components.css         # Enhanced component styles
    └── animations.css         # NEW: Smooth transitions
```

### Key Technical Decisions
1. **Canva Design SDK** - Use `getDesignContent()` to read images
2. **Local calculations** - DPI analysis happens client-side
3. **No backend needed** for MVP - keeps it simple
4. **React hooks** - Clean state management

---

## 🎨 UI/UX Design Goals

### Visual Design
- Premium dark theme option (matches many design workflows)
- Clear visual hierarchy with status colors
- Micro-animations for engagement
- Professional iconography
- Mobile-responsive (Canva panel is narrow)

### User Flow
1. **Welcome** → Select print job type
2. **Quick Scan** → One-click analysis of current design
3. **Results Dashboard** → See all issues at a glance
4. **Detailed Checklist** → Step-by-step resolution
5. **Export Ready** → All checks passed, export guidance

---

## 📚 Domain Knowledge to Build In

### DPI Guidelines by Print Type
| Format | Minimum DPI | Recommended DPI | Notes |
|--------|-------------|-----------------|-------|
| Business Cards | 300 | 350+ | Close viewing, high quality |
| Flyers/Brochures | 300 | 300 | Standard print |
| Posters (small) | 200 | 300 | Arm's length viewing |
| Large Posters | 150 | 200 | Few feet viewing |
| Vinyl Banners | 72-100 | 150 | Distance viewing |
| Billboard | 25-50 | 72 | Far viewing distance |

### Viewing Distance Formula
**Recommended DPI = 3438 / Viewing Distance (inches)**

### Large Format Education Points
- "Your 24x36 poster doesn't need 300 DPI if viewed from 3+ feet"
- "Billboard images at 25 DPI look sharp from the road"
- "Vinyl banners: focus on color vibrancy, not pixel perfection"

### Common Prepress Mistakes
1. Pure black text (should be 100K, not rich black)
2. RGB images without conversion awareness
3. Missing bleed on full-bleed designs
4. Text too close to trim edge
5. Low-res images scaled up significantly

---

## 🔧 Development Priorities

### Must Have (MVP)
- [x] Print job selection
- [ ] Professional UI polish
- [ ] DPI analyzer with recommendations
- [ ] Large format DPI education
- [ ] Basic preflight checklist
- [ ] Clear pass/fail status

### Should Have (if time allows)
- [ ] Multiple image analysis
- [ ] Color space warnings
- [ ] Export recommendations
- [ ] Save preferences

### Nice to Have (post-launch)
- [ ] Custom job profiles
- [ ] History/reports
- [ ] Team features
- [ ] Integration with print shops

---

## 📊 Success Metrics

### MVP Launch Criteria
- [ ] App runs without errors
- [ ] DPI analysis works on test designs
- [ ] UI looks professional
- [ ] Clear value demonstrated in 30 seconds
- [ ] Ready for Canva review submission

### User Feedback Goals
- "This would have saved me from that reprint"
- "I finally understand DPI for large format"
- "This is exactly what our design team needs"

---

## 🚀 Next Steps

1. **Today:** Start UI redesign and architecture refactor
2. **Tomorrow:** Implement DPI analysis core logic
3. **Day 3:** Connect analysis to UI, add first tips
4. **Day 4-5:** Build out full feature set
5. **Day 6-7:** Polish and edge cases
6. **Day 8-9:** Testing
7. **Day 10:** Submission prep

---

*Let's build something that makes prepress operators smile.* 🖨️✨
