// Test the complete data flow: Google Sheets → Netlify Functions → Vue Services
import userService from '../src/services/userService.js'

async function testFullDataFlow() {
  console.log('🧪 Testing complete data flow...')
  
  try {
    console.log('\n1️⃣ Testing User Service...')
    
    // Test getting user data
    const userA = await userService.getUser('A')
    console.log('✅ User A loaded:', {
      name: userA.name,
      age: userA.age,
      goal: userA.goal,
      weight: userA.current_weight_kg
    })
    
    const userB = await userService.getUser('B')
    console.log('✅ User B loaded:', {
      name: userB.name,
      age: userB.age,
      goal: userB.goal,
      weight: userB.current_weight_kg
    })
    
    console.log('\n2️⃣ Testing Progress Data...')
    
    // Test progress data
    const progressA = await userService.getProgressData('A')
    console.log('✅ User A Progress:', {
      weight: progressA.weight.current,
      muscle: progressA.muscle.current,
      bodyFat: progressA.bodyFat.current
    })
    
    const progressB = await userService.getProgressData('B')
    console.log('✅ User B Progress:', {
      weight: progressB.weight.current,
      muscle: progressB.muscle.current,
      bodyFat: progressB.bodyFat.current
    })
    
    console.log('\n3️⃣ Testing Weekly Status...')
    
    // Test weekly status
    const weeklyA = await userService.getWeeklyStatus('A')
    console.log('✅ User A Weekly Status:', weeklyA)
    
    const weeklyB = await userService.getWeeklyStatus('B')
    console.log('✅ User B Weekly Status:', weeklyB)
    
    console.log('\n🎉 All API tests passed!')
    console.log('🚀 Ready to connect to Vue.js frontend!')
    
  } catch (error) {
    console.error('❌ API test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Make sure `netlify dev` is running')
    console.log('   2. Check that your Google Sheets connection is working')
    console.log('   3. Verify your .env.local variables are correct')
  }
}

testFullDataFlow()
