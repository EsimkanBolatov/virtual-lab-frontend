# 🎬 Анимациялар Спецификациясы

## 🎯 Жалпы принциптер

### Анимация мақсаттары:
1. **Білім беру** - процесті көрсету
2. **Қызығушылық** - оқушыны тарту
3. **Feedback** - әрекеттің нәтижесін көрсету
4. **Жүйелік** - қадам-қадам түсіндіру

### Техникалық параметрлер:
- **Ұзақтығы**: 0.3s - 2s (орташа 0.8s)
- **Easing**: `ease-in-out`, `spring`
- **FPS**: 60 (жылы)
- **Библиотека**: Framer Motion

---

## 🧪 1. HCl Бейтараптану - Анимация Map

### 1.1 Химиялық заттарды таңдау
```javascript
// Framer Motion config
const selectAnimation = {
  initial: { scale: 1, opacity: 1 },
  hover: { 
    scale: 1.05, 
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 },
  selected: {
    borderColor: "#3b82f6",
    backgroundColor: "#dbeafe",
    scale: 1.02
  }
}
```

**Визуалды эффект:**
- Hover: карточка үлкейеді (5%)
- Click: басылады (scale 0.95)
- Selected: border көк, фон ашық көк

### 1.2 Араластыру (Mixing)
```javascript
const mixingAnimation = {
  beaker: {
    scale: [1, 1.05, 1],
    rotate: [0, -2, 2, -2, 0],
    transition: { 
      duration: 1.5, 
      repeat: 2,
      ease: "easeInOut" 
    }
  },
  liquid: {
    height: ["0%", "80%"],
    backgroundColor: [
      "transparent",
      "#ffcccc", // HCl түсі
      "#b3d9ff"  // Аралас түс
    ],
    transition: { duration: 2, ease: "easeIn" }
  }
}
```

**Визуалды эффект:**
1. Стакан сәл қимылдайды (mixing simulation)
2. Сұйықтық 0% -> 80% толады
3. Түс ақырындап өзгереді: қызыл -> көк

### 1.3 Көпіршіктер (Bubbles)
```javascript
const bubblesAnimation = {
  bubble: {
    initial: { 
      y: 300, 
      opacity: 0.6,
      scale: 0.5
    },
    animate: { 
      y: -50, 
      opacity: 0,
      scale: [0.5, 1, 1.2],
      x: `+=${Math.random() * 40 - 20}` // Random deviation
    },
    transition: { 
      duration: 2,
      ease: "easeOut",
      repeat: Infinity,
      delay: Math.random() * 0.5
    }
  }
}
```

**Визуалды эффект:**
- 10-15 көпіршік түбінен жоғары көтеріледі
- Random траектория
- Opacity 0.6 -> 0 (жойылады)
- Scale өседі (үлкейеді)

### 1.4 Түс өзгерісі (Color Change)
```javascript
const colorChangeAnimation = {
  indicator: {
    neutral: "transparent",
    acid: "#ff6b6b",
    base: "#4dabf7",
    transition: {
      duration: 1.5,
      ease: "easeInOut"
    }
  },
  glow: {
    boxShadow: [
      "0 0 0px rgba(59, 130, 246, 0)",
      "0 0 20px rgba(59, 130, 246, 0.6)",
      "0 0 40px rgba(59, 130, 246, 0.4)",
      "0 0 20px rgba(59, 130, 246, 0.6)"
    ],
    transition: {
      duration: 2,
      repeat: 2
    }
  }
}
```

**Визуалды эффект:**
- Индикатор қосылғанда түс бірден өзгеріп кетпейді
- 1.5 секунд ішінде gradual өзгереді
- Glow effect (жарқыраған сәуле)

### 1.5 Реакция теңдеуі (Equation Display)
```javascript
const equationAnimation = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  text: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.5,
      ease: "backOut",
      staggerChildren: 0.1 // Әріптер біртіндеп пайда болады
    }
  }
}
```

**Визуалды эффект:**
- Equation container төменнен жоғары slide болады
- Әр символ stagger effect арқылы пайда болады
- Scale: 0.8 -> 1 (bouncy effect)

---

## 🧬 2. Басқа лабораториялар үшін анимация

### 2.1 Микроскоп (9-сынып Биология - Митоз)
```javascript
const microscopeAnimation = {
  zoom: {
    scale: [1, 3, 5, 10],
    transition: { 
      duration: 3,
      times: [0, 0.3, 0.6, 1] 
    }
  },
  focus: {
    blur: ["blur(10px)", "blur(5px)", "blur(0px)"],
    opacity: [0.5, 0.8, 1]
  }
}
```

### 2.2 Сүйек құрылымы (8-сынып Биология)
```javascript
const boneAnimation = {
  rotation: {
    rotateY: [0, 360],
    transition: { 
      duration: 10, 
      repeat: Infinity,
      ease: "linear"
    }
  },
  layerReveal: {
    opacity: [0, 1],
    scale: [0.9, 1],
    transition: { 
      duration: 1.5,
      staggerChildren: 0.3
    }
  }
}
```

### 2.3 Тұнба түзілу (10-сынып Химия)
```javascript
const precipitateAnimation = {
  formation: {
    opacity: [0, 1],
    y: [-50, 0],
    scale: [0, 1],
    transition: {
      duration: 2,
      ease: "easeIn"
    }
  },
  particles: {
    // 50+ бөлшектер төменге түседі
    y: [0, 150],
    opacity: [1, 0.3],
    rotate: [0, 360],
    transition: {
      duration: 3,
      ease: "easeOut",
      staggerChildren: 0.05
    }
  }
}
```

---

## 📊 3. Performance Optimization

### GPU Acceleration
```css
/* Тек transform және opacity қолдану */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* GPU layer құру */
}
```

### Framer Motion Optimization
```javascript
// layoutId қолдану shared transitions үшін
<motion.div layoutId="beaker" />

// AnimatePresence exit анимациясы үшін
<AnimatePresence mode="wait">
  {showElement && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>

// useReducedMotion hook accessibility үшін
const shouldReduceMotion = useReducedMotion();
const animation = shouldReduceMotion ? {} : complexAnimation;
```

---

## 🎨 4. Түстер палитрасы

### Химия:
- Қышқыл: `#ff6b6b` (қызыл)
- Сілті: `#4dabf7` (көк)
- Neutral: `#a8dadc` (жасыл-көк)
- Тұнба: `#f1f3f5` (ақ-сұр)

### Биология:
- Жасуша: `#b197fc` (күлгін)
- Ядро: `#4c6ef5` (көк)
- Цитоплазма: `#ffd43b` (сары)

### UI Elements:
- Success: `#51cf66`
- Error: `#ff6b6b`
- Warning: `#ffd43b`
- Info: `#4dabf7`

---

## 🔊 5. Дыбыстар (Future Enhancement)

### Қажетті Sound Effects:
1. **Click** - батырма басу
2. **Pour** - құю дыбысы
3. **Bubble** - көпіршік дыбысы
4. **Success** - дұрыс жауап
5. **Error** - қате

```javascript
// Web Audio API немесе Howler.js
const sounds = {
  click: new Audio('/sounds/click.mp3'),
  pour: new Audio('/sounds/pour.mp3'),
  success: new Audio('/sounds/success.mp3')
};

// Play on action
sounds.pour.play();
```

---

## ✅ Animation Checklist

- [ ] Smooth transitions (60 FPS)
- [ ] Meaningful animations (білім беру)
- [ ] Reduced motion support
- [ ] Mobile optimization
- [ ] Loading states
- [ ] Error states
- [ ] Success feedback
- [ ] Consistent timing
- [ ] Accessible (prefers-reduced-motion)

---

**Барлық анимациялар білім беру мақсатына сәйкес болуы керек!**