# 🏋️‍♀️ Dual-User Workout Manager

A comprehensive, mobile-optimized web application for managing personalized workout routines for two users with different fitness goals.

## 🎯 **Overview**

This system creates and tracks daily workout routines for two female workout partners:
- **User A**: Muscle building focus (28 years old, 158cm, 48kg)
- **User B**: Weight loss focus (27 years old, 165cm, 67kg, target: 60kg in 1 month)

## ✨ **Features**

### 📱 **Mobile-First Design**
- **Progressive Web App (PWA)** - Install as native app on mobile
- **Touch-optimized interface** for gym use
- **Offline functionality** with local data persistence
- **Real-time progress tracking** with visual indicators

### 🏋️‍♀️ **Comprehensive Workout Structure**
- **🔥 Warm-up** - Target muscle activation and movement prep
- **🤸 Dynamic Stretching** - Movement-specific preparation
- **💪 Primary Exercises** - Main muscle group work with progressive overload
- **🎯 Secondary Exercises** - Complementary muscle training
- **⚡ Cardio Finisher** (User B only) - Metabolic conditioning
- **🧘 Cool-down & Stretching** - Recovery and flexibility

### 📊 **Smart Tracking System**
- **Set-by-set completion** with tap-to-check interface
- **Individual exercise notes** for form cues and adjustments
- **Rest time indicators** with visual timers
- **RPE (Rate of Perceived Exertion)** tracking
- **Session duration and energy level** logging

### 📈 **Progress Management**
- **Body composition tracking** with InBody scan integration
- **Weekly workout overview** with status indicators
- **Goal-specific metrics** (muscle gain vs. weight loss)
- **Performance trends** and improvement tracking

### 🎨 **User Experience**
- **Dual-user switching** with personalized data
- **Color-coded workout sections** for easy navigation
- **Modal-based data entry** for body composition
- **Weekly dashboard** with progress visualization

## 🏗️ **Technical Stack**

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with mobile-responsive design
- **Icons**: Lucide React for consistent iconography
- **Storage**: Browser localStorage for offline persistence
- **Deployment**: Netlify with automatic GitHub integration
- **Data Integration**: Google Sheets API (planned) for backup and analysis

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (>=18.0.0)
- npm (>=8.0.0) or yarn
- Git

### **Installation**
```bash
# Clone the repository
git clone https://github.com/alstjgg/workout_manager.git
cd workout_manager

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### **Building for Production**
```bash
npm run build
```

## 📱 **Usage**

### **Daily Workout Flow**
1. **Select User** (A or B) at the top of the app
2. **Navigate to "Today"** tab to see current workout
3. **Follow the structured routine**:
   - Complete warm-up exercises by tapping checkboxes
   - Progress through dynamic stretching
   - Execute primary exercises with set-by-set tracking
   - Finish secondary exercises and cooldown
4. **Log session summary** (duration, RPE, notes)
5. **Save to database** for progress tracking

### **Weekly Planning**
- **Use "Week" tab** to see 7-day overview
- **Track completion status** across all sessions
- **Monitor weekly volume** and consistency
- **Plan rest and recovery days**

### **Progress Tracking**
- **Navigate to "Progress" tab** for stats and goals
- **Update body composition** via modal interface
- **Track strength benchmarks** and improvements
- **Monitor goal achievement** (muscle gain/weight loss)

## 📊 **Workout Split Framework**

### **Weekly Structure**
- **Monday**: Glutes (Primary) + Shoulders (Secondary)
- **Tuesday**: Back (Primary) + Chest (Secondary)  
- **Wednesday**: Hips/Legs (Primary) + Arms (Secondary)
- **Thursday**: Chest (Primary) + Back (Secondary)
- **Friday**: Full Body/Mixed (compound movements)
- **Saturday**: Core/Functional + Light cardio
- **Sunday**: Rest day (User A) / Active recovery (User B)

### **Daily Flow Structure**
1. **Warm-up** (5-10 minutes) - General movement + target muscle activation
2. **Dynamic Stretching** (5 minutes) - Movement-specific preparation
3. **Primary Exercises** (30-45 minutes) - Heavy compound movements
4. **Secondary Exercises** (15-20 minutes) - Isolation and complementary work
5. **Cool-down** (5-10 minutes) - Recovery stretching

## 🔧 **Configuration**

### **User Profiles**
- **User A**: Muscle building, 6-12 rep ranges, longer rest periods
- **User B**: Weight loss, 12-20 rep ranges, shorter rest periods, cardio finisher

### **Progressive Overload**
- **Automatic weight suggestions** based on previous performance
- **RPE-based intensity adjustments**
- **Weekly progression tracking**

## 🎯 **Future Enhancements**

### **Phase 1: Data Integration**
- [ ] Google Sheets API integration for backup
- [ ] Claude API for intelligent workout generation
- [ ] Performance analytics and recommendations

### **Phase 2: Advanced Features**
- [ ] Built-in rest timers with notifications
- [ ] Exercise form videos and instructions
- [ ] Nutrition tracking integration
- [ ] Social sharing and motivation features

### **Phase 3: Intelligence**
- [ ] AI-powered workout adaptation
- [ ] Injury prevention algorithms
- [ ] Personalized recovery recommendations
- [ ] Advanced progress prediction

## 📱 **Mobile Installation**

### **iOS (iPhone/iPad)**
1. Open the app in Safari
2. Tap the "Share" button
3. Select "Add to Home Screen"
4. Tap "Add" to install

### **Android**
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add" to install

## 🤝 **Contributing**

This is a personal fitness management system. For suggestions or bug reports, please create an issue in the repository.

## 📄 **License**

This project is for personal use. All rights reserved.

## 🙏 **Acknowledgments**

- Built with guidance from Claude AI for system architecture and development
- Tailwind CSS for responsive design framework
- Lucide React for beautiful, consistent icons
- React community for excellent documentation and resources

---

**Live Demo**: [Deployed on Netlify](https://your-app-url.netlify.app) *(Update with your actual URL)*

**Last Updated**: September 2025