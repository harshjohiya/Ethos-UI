import { supabase } from '@/integrations/supabase/client';

// Sample data for seeding the database
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // 1. Seed Profiles
    const profiles = [
      {
        entity_id: 'student-001',
        name: 'John Doe',
        role: 'student',
        email: 'john.doe@university.edu',
        department: 'Computer Science',
        student_id: 'CS2021001',
        card_id: 'CARD001',
        device_hash: 'HASH001',
        face_id: 'FACE001',
      },
      {
        entity_id: 'student-002',
        name: 'Jane Smith',
        role: 'student',
        email: 'jane.smith@university.edu',
        department: 'Engineering',
        student_id: 'ENG2021002',
        card_id: 'CARD002',
        device_hash: 'HASH002',
        face_id: 'FACE002',
      },
      {
        entity_id: 'staff-001',
        name: 'Dr. Robert Johnson',
        role: 'staff',
        email: 'robert.johnson@university.edu',
        department: 'Computer Science',
        staff_id: 'STAFF001',
        card_id: 'CARD003',
        device_hash: 'HASH003',
        face_id: 'FACE003',
      },
      {
        entity_id: 'student-003',
        name: 'Alice Brown',
        role: 'student',
        email: 'alice.brown@university.edu',
        department: 'Mathematics',
        student_id: 'MATH2021003',
        card_id: 'CARD004',
        device_hash: 'HASH004',
        face_id: 'FACE004',
      },
      {
        entity_id: 'student-004',
        name: 'Bob Wilson',
        role: 'student',
        email: 'bob.wilson@university.edu',
        department: 'Physics',
        student_id: 'PHY2021004',
        card_id: 'CARD005',
        device_hash: 'HASH005',
        face_id: 'FACE005',
      },
    ];

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(profiles as any, { onConflict: 'entity_id' });

    if (profileError) {
      console.error('Error seeding profiles:', profileError);
    } else {
      console.log('✓ Profiles seeded successfully');
    }

    // 2. Seed Campus Card Swipes
    const now = new Date();
    const cardSwipes = [];
    
    for (let i = 0; i < 50; i++) {
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      cardSwipes.push({
        card_id: `CARD00${(i % 5) + 1}`,
        location_id: ['Library', 'Cafeteria', 'Lab-A', 'Lab-B', 'Main-Gate'][Math.floor(Math.random() * 5)],
        timestamp: timestamp.toISOString(),
      });
    }

    const { data: swipeData, error: swipeError } = await supabase
      .from('campus_card_swipes')
      .insert(cardSwipes as any);

    if (swipeError) {
      console.error('Error seeding card swipes:', swipeError);
    } else {
      console.log('✓ Card swipes seeded successfully');
    }

    // 3. Seed WiFi Associations
    const wifiLogs = [];
    
    for (let i = 0; i < 30; i++) {
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      wifiLogs.push({
        device_hash: `HASH00${(i % 5) + 1}`,
        ap_id: ['AP-Library', 'AP-Cafeteria', 'AP-Lab-A', 'AP-Lab-B'][Math.floor(Math.random() * 4)],
        timestamp: timestamp.toISOString(),
      });
    }

    const { data: wifiData, error: wifiError } = await supabase
      .from('wifi_associations_logs')
      .insert(wifiLogs as any);

    if (wifiError) {
      console.error('Error seeding wifi logs:', wifiError);
    } else {
      console.log('✓ WiFi logs seeded successfully');
    }

    // 4. Seed Bookings
    const bookings = [];
    
    for (let i = 0; i < 10; i++) {
      const daysAhead = Math.floor(Math.random() * 7);
      const startTime = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      
      bookings.push({
        booking_id: `BOOK-${Date.now()}-${i}`,
        entity_id: `student-00${(i % 4) + 1}`,
        room_id: `Room-${Math.floor(Math.random() * 5) + 1}`,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        attended: Math.random() > 0.3,
      });
    }

    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookings as any);

    if (bookingError) {
      console.error('Error seeding bookings:', bookingError);
    } else {
      console.log('✓ Bookings seeded successfully');
    }

    // 5. Seed Library Checkouts
    const checkouts = [];
    
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      checkouts.push({
        checkout_id: `CHECKOUT-${Date.now()}-${i}`,
        entity_id: `student-00${(i % 4) + 1}`,
        book_id: `BOOK-${Math.floor(Math.random() * 100) + 1}`,
        timestamp: timestamp.toISOString(),
      });
    }

    const { data: checkoutData, error: checkoutError } = await supabase
      .from('library_checkouts')
      .insert(checkouts as any);

    if (checkoutError) {
      console.error('Error seeding library checkouts:', checkoutError);
    } else {
      console.log('✓ Library checkouts seeded successfully');
    }

    // 6. Seed CCTV Frames
    const cctvFrames = [];
    
    for (let i = 0; i < 40; i++) {
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      cctvFrames.push({
        frame_id: `FRAME-${Date.now()}-${i}`,
        location_id: ['Library', 'Cafeteria', 'Lab-A', 'Lab-B', 'Main-Gate'][Math.floor(Math.random() * 5)],
        face_id: `FACE00${(i % 5) + 1}`,
        timestamp: timestamp.toISOString(),
      });
    }

    const { data: cctvData, error: cctvError } = await supabase
      .from('cctv_frames')
      .insert(cctvFrames as any);

    if (cctvError) {
      console.error('Error seeding CCTV frames:', cctvError);
    } else {
      console.log('✓ CCTV frames seeded successfully');
    }

    console.log('✅ Database seeding completed!');
    return { success: true };
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    return { success: false, error };
  }
}

// Run this function from browser console or create a button to trigger it
if (typeof window !== 'undefined') {
  (window as any).seedDatabase = seedDatabase;
}
