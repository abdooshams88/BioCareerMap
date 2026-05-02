'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Chart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const TOTAL_STEPS = 4

// Passion Detector - 10 Scenarios
const PASSION_SCENARIOS = [
  {
    id: 1,
    titleAr: 'في المعمل',
    icon: '🔬',
    story: 'الساعة 9 الصبح. أنت واقف جنب الـ PCR machine وقدامك sample صغيرة. المشرف بصّلك وقالك "الأمر ليك". إيه اللي هتعمله الأول؟',
    type: 'choice',
    options: [
      { id: 'A', text: 'أفتح البروتوكول وأتبع كل خطوة بالظبط', categories: ['lab', 'academia'] },
      { id: 'B', text: 'أجرب بطريقتي الأول وبعدين أقارن', categories: ['lab', 'research'] },
      { id: 'C', text: 'أسأل زميلي اللي عنده تجربة أكتر', categories: ['communication', 'public'] },
      { id: 'D', text: 'أدوّن كل حاجة في notebook الأول', categories: ['lab', 'qc'] },
    ],
  },
  {
    id: 2,
    titleAr: 'المريض والنتيجة',
    icon: '🩺',
    story: 'بتشتغل في مختبر تحاليل. جه تقرير فيه نتيجة غريبة لمريض عنده. الدكتور مش متاح. أنت اللي لازم تقرر.',
    type: 'rating',
    categories: ['clinical', 'lab'],
  },
  {
    id: 3,
    titleAr: 'الـ Data والـ Screen',
    icon: '💻',
    story: 'أنت قاعد قدام اللاب توب من الصبح. عندك database فيها آلاف الـ gene sequences ومفروض تلاقي pattern معين. مفيش حد حواليك — بس أنت والـ code والبيانات.',
    type: 'rating',
    categories: ['bioinformatics', 'lab'],
  },
  {
    id: 4,
    titleAr: 'في المصنع',
    icon: '🏭',
    story: 'أنت في خط الإنتاج في مصنع أدوية. كل نص ساعة بتاخد sample وبتعمل quality check. الشغل منتظم، دقيق، ومسؤوليته عالية — غلطة صغيرة ممكن تأثر على آلاف الناس.',
    type: 'choice',
    options: [
      { id: 'A', text: 'ده النوع ده الشغل اللي بيريحني', categories: ['qc', 'industry'] },
      { id: 'B', text: 'أنا هشتغل كويس بس هيملني', categories: ['qc', 'industry'] },
      { id: 'C', text: 'ده مش بالظبط اللي تخيلته', categories: ['research', 'academia'] },
      { id: 'D', text: 'أنا هخليه أمتع من كده', categories: ['industry', 'startup'] },
    ],
  },
  {
    id: 5,
    titleAr: 'أمام الجمهور',
    icon: '🎤',
    story: 'بتقدم research paper في مؤتمر علمي. في الأوضة ٥٠ دكتور وباحث بيبصوا فيك. الـ slide الأولى اتفتحت. إيه اللي بتحس بيه دلوقتي؟',
    type: 'choice',
    options: [
      { id: 'A', text: 'متحمس — ده اللحظة اللي استنيتها', categories: ['communication', 'public'] },
      { id: 'B', text: 'خايف بس هعدي عليها', categories: ['communication', 'lab'] },
      { id: 'C', text: 'مش مرتاح خالص للموضوع ده', categories: ['lab', 'research'] },
      { id: 'D', text: 'أنا هتكلم وكأني بحكي لصحابي', categories: ['communication', 'public'] },
    ],
  },
  {
    id: 6,
    titleAr: 'البيزنس والعلم',
    icon: '💼',
    story: 'عندك فرصة تشتغل مع شركة أدوية في المبيعات الطبية. الراتب عالي، بتتكلم مع أطباء كل يوم، وبتشرح المنتجات. بس مش هتبقى في معمل.',
    type: 'rating',
    categories: ['sales', 'public'],
  },
  {
    id: 7,
    titleAr: 'الأزمة',
    icon: '⚠️',
    story: 'في وسط تجربة مهمة، حاجة غلط. النتايج مش منطقية والوقت بينفد. المشرف مش موجود والفريق بيبص عليك.',
    type: 'choice',
    options: [
      { id: 'A', text: 'أوقف كل حاجة وأحلل المشكلة بهدوء', categories: ['lab', 'research'] },
      { id: 'B', text: 'أجرب حلول سريعة وأشوف إيه اللي ينفع', categories: ['problem', 'industry'] },
      { id: 'C', text: 'أتصل بالمشرف على طول حتى لو متأخر', categories: ['communication', 'public'] },
      { id: 'D', text: 'أوثّق كل حاجة وأكمل بحذر', categories: ['qc', 'lab'] },
    ],
  },
  {
    id: 8,
    titleAr: 'التدريس والتعليم',
    icon: '📚',
    story: 'طُلب منك تشرح لمجموعة طلاب في أولى كيف يعمل الـ ELISA. عندك ساعة وسبورة وكيت تجريبي.',
    type: 'rating',
    categories: ['communication', 'teaching'],
  },
  {
    id: 9,
    titleAr: 'الحقل والطبيعة',
    icon: '🌳',
    story: 'بتشتغل في مشروع بيئي. كل يوم بتروح موقع مختلف — نيل، تربة، هواء. بتاخد samples برة المعمل وبتسجل بياناتها.',
    type: 'choice',
    options: [
      { id: 'A', text: 'ده حلم — أنا بحب الشغل البراني', categories: ['field', 'environment'] },
      { id: 'B', text: 'مش مشكلة بس مش أولويتي', categories: ['field', 'lab'] },
      { id: 'C', text: 'أنا شايف نفسي في المعمل أكتر', categories: ['lab', 'research'] },
      { id: 'D', text: 'يعتمد على الدولة والراتب', categories: ['public', 'field'] },
    ],
  },
  {
    id: 10,
    titleAr: 'البحث والنشر',
    icon: '📄',
    story: 'قضيت ٦ أشهر في بحث. دلوقتي بتكتب الـ paper. لما تشوف اسمك كـ first author لأول مرة في journal دولية — إيه اللي هتحس بيه؟',
    type: 'rating',
    categories: ['academia', 'writing'],
  },
]

// Passion Types
const PASSION_TYPES = [
  { id: 'scientist', titleAr: 'العالِم الصبور', titleEn: 'The Patient Scientist', desc: 'تحب الدقة والتوثيق. الراحة عندك في المعمل وأنت تتبع البروتوكول خطوة بخطوة. صبور مع النتائج وطول التفكير.', icon: '🔬', categories: ['lab', 'academia', 'qc'] },
  { id: 'analyst', titleAr: 'المحلل الرقمي', titleEn: 'The Digital Analyst', desc: 'أنت تلاقي المتعة في الـ data والـ patterns. اللاب توب صديقك والـ code لغتك. تحب تحلل وتكتشف.', icon: '💻', categories: ['bioinformatics', 'research'] },
  { id: 'communicator', titleAr: 'المتواصل العلمي', titleEn: 'The Science Communicator', desc: 'تحب تشرح للناس وتخليهم يفهموا. تقدم بفكرة وكأنك تحكي لصحابك. الحب عندك في التعليم والتأثير.', icon: '🎤', categories: ['communication', 'public', 'teaching'] },
  { id: 'problemsolver', titleAr: 'حلّال المشاكل', titleEn: 'The Problem Solver', desc: 'الأزمات تحمّسك. لما يكون في مشكلة صعبة، ده وقتك. بتحل مشكلات عملية بسرعة.', icon: '🛠️', categories: ['problem', 'industry', 'clinical'] },
  { id: 'builder', titleAr: 'الصانع والمنظّم', titleEn: 'The Builder', desc: 'تحب التنظيم والـ systems. الشغل المنتظم بيرتاحك. دقة عالية ومسؤولية — تحب تشوف نتيجة nyata.', icon: '🏭', categories: ['qc', 'industry', 'production'] },
  { id: 'influencer', titleAr: 'المؤثر الميداني', titleEn: 'The Field Influencer', desc: 'تحب تتعامل مع ناس.影响力 عندك في الت��اصل المباشر. بتحب تشوف أثر كلامك على الناس.', icon: '🌍', categories: ['sales', 'public', 'field'] },
]

// Map 12 career tracks to 6 categories
const FIELD_CATEGORIES = {
  'academia': ['academia'],
  'sales': ['sales', 'public'],
  'qc': ['qc', 'industry'],
  'lab': ['lab', 'clinical'],
  'bioinfo': ['bioinformatics'],
  'startup': ['startup', 'problem'],
  'writing': ['writing', 'communication'],
  'foodsafety': ['qc', 'industry'],
  'publichealth': ['public', 'field'],
  'environment': ['field', 'environment'],
  'genetic': ['clinical', 'lab'],
  'veterinary': ['clinical', 'lab'],
}

const SWOT_QUESTIONS = [
  { id: 1, text: 'I finish lab reports and assignments before their deadline', category: 'strengths' },
  { id: 2, text: 'I enjoy reading scientific papers or textbooks in my free time', category: 'strengths' },
  { id: 3, text: 'I prefer working alone over working in groups', category: 'weaknesses' },
  { id: 4, text: 'When I make a mistake, I analyze what went wrong before moving on', category: 'strengths' },
  { id: 5, text: 'I feel comfortable speaking or presenting in front of people', category: 'strengths' },
  { id: 6, text: 'I get stressed easily when facing unexpected problems', category: 'weaknesses' },
  { id: 7, text: 'I can manage multiple tasks or deadlines at the same time', category: 'strengths' },
  { id: 8, text: 'I actively look for internship or research opportunities on my own', category: 'opportunities' },
  { id: 9, text: 'I feel motivated more by money and financial stability than by passion', category: 'threats' },
  { id: 10, text: 'I believe I can learn any skill if I put in the effort', category: 'strengths' },
  { id: 11, text: 'I follow through on long-term projects even when they get boring', category: 'strengths' },
  { id: 12, text: 'I take initiative in group work rather than waiting to be told what to do', category: 'strengths' },
  { id: 13, text: 'I find it hard to say no to people who ask for my help', category: 'weaknesses' },
  { id: 14, text: 'I prefer practical, hands-on work over theoretical study', category: 'strengths' },
  { id: 15, text: 'I keep track of my goals and review them regularly', category: 'strengths' },
  { id: 16, text: 'I get discouraged by failure or negative feedback', category: 'weaknesses' },
  { id: 17, text: 'I am aware of the job market and typical salaries in my field', category: 'opportunities' },
  { id: 18, text: 'I feel financially pressured by my family situation', category: 'threats' },
  { id: 19, text: 'I would be willing to work or study abroad if a good opportunity came up', category: 'opportunities' },
  { id: 20, text: 'I believe hard work alone is enough to succeed in Egypt\'s biology job market', category: 'threats' },
]

const SCALE_LABELS = [
  { key: 'none', labelAr: 'لا أبداً', value: 1 },
  { key: 'rarely', labelAr: 'نادراً', value: 2 },
  { key: 'sometimes', labelAr: 'أحياناً', value: 3 },
  { key: 'often', labelAr: 'كثيراً', value: 4 },
  { key: 'always', labelAr: 'دايماً', value: 5 },
]

const HARD_SKILLS = [
  'PCR and molecular biology techniques',
  'Cell culture',
  'Microscopy (light + electron)',
  'ELISA and immunological assays',
  'Bioinformatics basics (BLAST, NCBI)',
  'Scientific writing',
  'Statistical analysis (SPSS or Excel)',
  'Good Laboratory Practice (GLP)',
  'HACCP knowledge',
  'ISO standards awareness',
  'Basic research methodology',
]

const SOFT_SKILLS = [
  'Time management',
  'Team communication',
  'Problem solving',
  'Critical thinking',
  'Presentation skills',
  'English language proficiency',
  'Arabic scientific writing',
  'Leadership',
  'Networking',
  'Stress management',
]

const SKILL_LEVELS = [
  { key: 'none', labelAr: 'لا أعرفه', value: 0 },
  { key: 'heard', labelAr: 'سمعت عنه', value: 1 },
  { key: 'basic', labelAr: 'أساسيات', value: 2 },
  { key: 'proficient', labelAr: 'متمكن', value: 3 },
  { key: 'expert', labelAr: 'خبير', value: 4 },
]

const CAREER_TRACKS = [
  { id: 'academia', titleAr: 'أكاديميا و البحث', titleEn: 'Academia & Research', salary: '8,000 - 15,000 EGP', certs: 'MSc, PhD', demand: 'Medium' },
  { id: 'sales', titleAr: 'مبيعات طبية و أدوية', titleEn: 'Medical Sales & Pharma', salary: '12,000 - 25,000 EGP', certs: 'Sales Training', demand: 'High' },
  { id: 'qc', titleAr: 'التحكم في الجودة', titleEn: 'Quality Control (QC)', salary: '8,000 - 14,000 EGP', certs: 'ISO, HACCP', demand: 'High' },
  { id: 'lab', titleAr: 'فني مختبرات', titleEn: 'Medical Lab Technician', salary: '6,000 - 12,000 EGP', certs: 'Lab Certification', demand: 'Medium' },
  { id: 'bioinfo', titleAr: 'المعلومات الحيوية', titleEn: 'Bioinformatics', salary: '15,000 - 30,000 EGP', certs: 'Programming, Biology', demand: 'High' },
  { id: 'startup', titleAr: 'ريادة الأعمال', titleEn: 'Biotech Startup', salary: '10,000 - 40,000 EGP', certs: 'MBA, Biotech', demand: 'Medium' },
  { id: 'writing', titleAr: 'الكتابة العلمية', titleEn: 'Scientific Writing', salary: '8,000 - 18,000 EGP', certs: 'Writing Courses', demand: 'Medium' },
  { id: 'foodsafety', titleAr: 'سلامة الغذاء', titleEn: 'Food Safety & HACCP', salary: '7,000 - 13,000 EGP', certs: 'HACCP, ISO 22000', demand: 'High' },
  { id: 'publichealth', titleAr: 'الصحة العامة', titleEn: 'Public Health', salary: '10,000 - 20,000 EGP', certs: 'MPH', demand: 'Medium' },
  { id: 'environment', titleAr: 'البيئة و الحياة البرية', titleEn: 'Environmental Biology', salary: '8,000 - 15,000 EGP', certs: 'Environmental Certs', demand: 'Low' },
  { id: 'genetic', titleAr: 'إرشاد الجينات', titleEn: 'Genetic Counseling', salary: '12,000 - 25,000 EGP', certs: 'Genetic Counseling Cert', demand: 'Medium' },
  { id: 'veterinary', titleAr: 'صحة الحيوان', titleEn: 'Animal Health', salary: '8,000 - 16,000 EGP', certs: 'Veterinary Support Cert', demand: 'Low' },
]

export default function Onboarding() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')

  // Step 1: SWOT
  const [swotAnswers, setSwotAnswers] = useState<{ [key: number]: number }>({})

  // Step 2: Skill Grid
  const [skillLevels, setSkillLevels] = useState<{ [key: string]: string }>({})

  // Step 3: Passion Detector
  const [passionStep, setPassionStep] = useState(1)
  const [passionAnswers, setPassionAnswers] = useState<{ [key: number]: { choice?: string; excitement?: number; capability?: number } }>({})
  const [showResults, setShowResults] = useState(false)
  const [passionResults, setPassionResults] = useState<{ bestFitField?: string; passionType?: string; fieldRankings?: { field: string; score: number }[] }>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  // Step 4: Career Tracks
  const [selectedTracks, setSelectedTracks] = useState<{ primary?: string, secondary?: string, tertiary?: string }>({})

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)
    loadProgress(user.id)
  }

  async function loadProgress(uid: string) {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', uid).single()
    if (data) {
      if (data.swot_results?.answers) {
        setSwotAnswers(data.swot_results.answers)
        setCurrentStep(2)
      }
      if (data.skill_grid && Object.keys(data.skill_grid).length > 0) {
        setSkillLevels(data.skill_grid)
        setCurrentStep(3)
      }
      if (data.passion_results) {
        setPassionResults(data.passion_results)
        setShowResults(true)
        setCurrentStep(4)
      }
      if (data.career_tracks && data.career_tracks.length >= 3) {
        setSelectedTracks({
          primary: data.career_tracks[0],
          secondary: data.career_tracks[1],
          tertiary: data.career_tracks[2],
        })
      }
    }
  }

  function calculateSWOT() {
    const scores: any = { strengths: 0, weaknesses: 0, opportunities: 0, threats: 0 }
    SWOT_QUESTIONS.forEach(q => {
      const answer = swotAnswers[q.id] || 0
      if (answer >= 4) {
        scores[q.category] += answer - 3
      }
    })
    return scores
  }

function calculatePassionResults() {
    const categoryScores: { [key: string]: number } = {}
    
    Object.entries(passionAnswers).forEach(([scenarioId, answer]) => {
      const sId = parseInt(scenarioId)
      const scenario = PASSION_SCENARIOS.find(s => s.id === sId)
      if (!scenario) return
      
      if (answer.choice && scenario.options) {
        const selectedOption = scenario.options.find(o => o.id === answer.choice)
        if (selectedOption) {
          selectedOption.categories.forEach(cat => {
            categoryScores[cat] = (categoryScores[cat] || 0) + 2
          })
        }
      }
      
      if (answer.excitement && answer.capability && scenario.categories) {
        const ratingValue = (answer.excitement || 3) + (answer.capability || 3)
        scenario.categories.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + ratingValue
        })
      }
    })

    const fieldRankings: { field: string; score: number }[] = CAREER_TRACKS.map(track => {
      let score = 0
      const cats = FIELD_CATEGORIES[track.id as keyof typeof FIELD_CATEGORIES]
      cats.forEach(cat => {
        score += categoryScores[cat] || 0
      })
      return { field: track.id, score }
    }).sort((a, b) => b.score - a.score)

    const bestFitField = fieldRankings[0]?.field || 'lab'

    let passionType = 'scientist'
    const topCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([cat]) => cat)
    if (topCategories.includes('bioinformatics') || topCategories.includes('data')) passionType = 'analyst'
    else if (topCategories.includes('communication') || topCategories.includes('public')) passionType = 'communicator'
    else if (topCategories.includes('problem') || topCategories.includes('industry')) passionType = 'problemsolver'
    else if (topCategories.includes('qc') || topCategories.includes('production')) passionType = 'builder'
    else if (topCategories.includes('sales') || topCategories.includes('field')) passionType = 'influencer'
    else if (topCategories.includes('lab') || topCategories.includes('academia')) passionType = 'scientist'

    return { bestFitField, passionType, fieldRankings }
  }

  async function saveProgress() {
    setSaving(true)
    try {
      const updateData: any = {
        user_id: userId,
        updated_at: new Date(),
      }

      if (currentStep === 1) {
        const result = calculateSWOT()
        updateData.swot_results = { answers: swotAnswers, ...result }
      }

      if (currentStep === 2) {
        updateData.skill_grid = skillLevels
      }

      if (currentStep === 3) {
        const results = calculatePassionResults()
        setPassionResults(results)
        updateData.passion_results = results
      }

      if (currentStep === 4) {
        updateData.career_tracks = [selectedTracks.primary, selectedTracks.secondary, selectedTracks.tertiary].filter(Boolean)
        updateData.completed_onboarding = true
      }

      const { error } = await supabase.from('profiles').upsert(updateData)
      if (error) throw error
    } catch (err) {
      console.error('Error saving:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (currentStep === 1 && Object.keys(swotAnswers).length < 20) return
    if (currentStep === 2 && Object.keys(skillLevels).length < HARD_SKILLS.length + SOFT_SKILLS.length) return
    if (currentStep === 3 && showResults) {
      await saveProgress()
      setCurrentStep(4)
      return
    }
    if (currentStep === 3 && !showResults) return
    if (currentStep === 4 && Object.keys(selectedTracks).length < 3) return

    await saveProgress()

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  function handleSwotAnswer(questionId: number, value: number) {
    setSwotAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function handleSkillLevel(skill: string, level: string) {
    setSkillLevels(prev => ({ ...prev, [skill]: level }))
  }

  function handleTrackSelect(trackId: string) {
    if (selectedTracks.primary === trackId) {
      setSelectedTracks(prev => ({ ...prev, primary: undefined }))
    } else if (!selectedTracks.primary) {
      setSelectedTracks(prev => ({ ...prev, primary: trackId }))
    } else if (selectedTracks.secondary === trackId) {
      setSelectedTracks(prev => ({ ...prev, secondary: undefined }))
    } else if (!selectedTracks.secondary) {
      setSelectedTracks(prev => ({ ...prev, secondary: trackId }))
    } else if (selectedTracks.tertiary === trackId) {
      setSelectedTracks(prev => ({ ...prev, tertiary: undefined }))
    } else if (!selectedTracks.tertiary) {
      setSelectedTracks(prev => ({ ...prev, tertiary: trackId }))
    }
  }

  function getTrackLabel(trackId: string) {
    if (selectedTracks.primary === trackId) return 'أساسي'
    if (selectedTracks.secondary === trackId) return 'ثانوي'
    if (selectedTracks.tertiary === trackId) return 'ثالث'
    return ''
  }

  function handlePassionChoice(choiceId: string) {
    setPassionAnswers(prev => ({ ...prev, [passionStep]: { ...prev[passionStep], choice: choiceId } }))
  }

  function handlePassionRating(type: 'excitement' | 'capability', value: number) {
    setPassionAnswers(prev => ({ ...prev, [passionStep]: { ...prev[passionStep], [type]: value } }))
  }

  function canProceedFromPassion() {
    const answer = passionAnswers[passionStep]
    const scenario = PASSION_SCENARIOS.find(s => s.id === passionStep)
    if (!answer || !scenario) return false
    if (scenario.type === 'choice') return !!answer.choice
    return !!answer.excitement && !!answer.capability
  }

  async function proceedToResults() {
    const results = calculatePassionResults()
    setPassionResults(results)
    setShowResults(true)
  }

  function preSelectTopTracks() {
    if (passionResults.fieldRankings && passionResults.fieldRankings.length >= 3) {
      setSelectedTracks({
        primary: passionResults.fieldRankings[0].field,
        secondary: passionResults.fieldRankings[1].field,
        tertiary: passionResults.fieldRankings[2].field,
      })
    }
  }

  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100

  // Chart data for Step 2
  const hardSkillsAvg = HARD_SKILLS.reduce((sum, skill) => {
    const level = SKILL_LEVELS.find(l => l.key === skillLevels[skill])
    return sum + (level?.value || 0)
  }, 0) / HARD_SKILLS.length * 25

  const softSkillsAvg = SOFT_SKILLS.reduce((sum, skill) => {
    const level = SKILL_LEVELS.find(l => l.key === skillLevels[skill])
    return sum + (level?.value || 0)
  }, 0) / SOFT_SKILLS.length * 25

  const chartData = {
    labels: ['Hard Skills', 'Soft Skills'],
    datasets: [{
      label: 'Your Skills',
      data: [hardSkillsAvg, softSkillsAvg],
      backgroundColor: 'rgba(200, 153, 26, 0.2)',
      borderColor: '#C8991A',
      borderWidth: 2,
      pointBackgroundColor: '#C8991A',
    }],
  }

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false },
        grid: { color: 'rgba(26, 26, 46, 0.1)' },
        angleLines: { color: 'rgba(26, 26, 46, 0.1)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7' }} dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm" style={{ color: '#1A1A2E', opacity: 0.6 }}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: '#C8991A',
              }}
            />
          </div>
        </div>

        {/* Step 1: SWOT Diagnostic */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">اكتشف نفسك</h2>
            <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>The BioCareerMap Diagnostic — 20 questions, about 8 minutes</p>

            <div className="space-y-8">
              {SWOT_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">
                    {q.id}. {q.text}
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {SCALE_LABELS.map((label) => (
                      <button
                        key={label.key}
                        onClick={() => handleSwotAnswer(q.id, label.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${swotAnswers[q.id] === label.value ? 'transform scale-105' : ''}`}
                        style={{
                          borderColor: swotAnswers[q.id] === label.value ? '#C8991A' : '#E5E7EB',
                          backgroundColor: swotAnswers[q.id] === label.value ? '#F5E6C8' : '#FFFFFF',
                          color: '#1A1A2E',
                        }}
                      >
                        <div className="text-sm font-bold">{label.labelAr}</div>
                        <div className="text-xs mt-1" style={{ opacity: 0.6 }}>{label.key}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                disabled
                className="px-8 py-3 rounded-lg font-bold transition-all"
                style={{ border: '2px solid #C8991A', color: '#C8991A' }}
              >
                السابق
              </button>

              <button
                onClick={handleNext}
                disabled={Object.keys(swotAnswers).length < 20}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
              >
                {saving ? 'جاري الحفظ...' : 'التالي'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skill Grid */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">أين أنت دلوقتك؟</h2>
            <p className="mb-8" style={{ color: '#1A1A2E', opacity: 0.7 }}>Where Are You Right Now? Rate your skills below.</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Hard Skills */}
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">المهارات الصلبة</h3>
                <div className="space-y-4">
                  {HARD_SKILLS.map((skill) => (
                    <div key={skill}>
                      <p className="text-sm mb-2" style={{ color: '#1A1A2E' }} dir="rtl">{skill}</p>
                      <div className="flex gap-2 flex-wrap">
                        {SKILL_LEVELS.map((level) => (
                          <button
                            key={level.key}
                            onClick={() => handleSkillLevel(skill, level.key)}
                            className="px-3 py-1 rounded-md text-xs transition-all"
                            style={{
                              backgroundColor: skillLevels[skill] === level.key ? '#C8991A' : '#FFFFFF',
                              color: skillLevels[skill] === level.key ? '#1A1A2E' : '#1A1A2E',
                              border: `1px solid ${skillLevels[skill] === level.key ? '#C8991A' : '#E5E7EB'}`,
                            }}
                          >
                            {level.labelAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0D6B6E' }} dir="rtl">المهارات الناعمة</h3>
                <div className="space-y-4">
                  {SOFT_SKILLS.map((skill) => (
                    <div key={skill}>
                      <p className="text-sm mb-2" style={{ color: '#1A1A2E' }} dir="rtl">{skill}</p>
                      <div className="flex gap-2 flex-wrap">
                        {SKILL_LEVELS.map((level) => (
                          <button
                            key={level.key}
                            onClick={() => handleSkillLevel(skill, level.key)}
                            className="px-3 py-1 rounded-md text-xs transition-all"
                            style={{
                              backgroundColor: skillLevels[skill] === level.key ? '#C8991A' : '#FFFFFF',
                              color: skillLevels[skill] === level.key ? '#1A1A2E' : '#1A1A2E',
                              border: `1px solid ${skillLevels[skill] === level.key ? '#C8991A' : '#E5E7EB'}`,
                            }}
                          >
                            {level.labelAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
              <h3 className="text-lg font-bold mb-4 text-center" style={{ color: '#1A1A2E' }} dir="rtl">ملفك المهاري</h3>
              <div className="w-full max-w-md mx-auto">
                <Chart type="radar" data={chartData} options={chartOptions} ref={chartRef} />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-lg font-bold transition-all"
                style={{ border: '2px solid #C8991A', color: '#C8991A' }}
              >
                السابق
              </button>

              <button
                onClick={handleNext}
                disabled={Object.keys(skillLevels).length < HARD_SKILLS.length + SOFT_SKILLS.length}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
              >
                {saving ? 'جاري الحفظ...' : 'التالي'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Passion Detector */}
        {currentStep === 3 && !showResults && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8" ref={scrollRef}>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">كشّاف الشغف</h2>
            <p className="mb-4" style={{ color: '#1A1A2E', opacity: 0.7 }}>دلوقتي هتختبر ١٠ سيناريوهات من حياتك كطالب علوم حياة في مصر. كل سيناريو قصفة قصيرة — اختار إيش بتحس بيه.</p>
            
            {/* Progress within passion step */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#0D6B6E' }} dir="rtl">{passionStep} من ١٠</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F5E6C8' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(passionStep / 10) * 100}%`, backgroundColor: '#C8991A' }}
                />
              </div>
            </div>

            {/* Scenario Card */}
            {PASSION_SCENARIOS.filter(s => s.id === passionStep).map(scenario => (
              <div key={scenario.id} className="animate-fadeIn">
                {/* Icon */}
                <div className="text-5xl mb-4 text-center">{scenario.icon}</div>
                
                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                  {scenario.titleAr}
                </h3>
                
                {/* Story */}
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                  <p className="text-lg leading-relaxed" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                    {scenario.story}
                  </p>
                </div>

                {/* Response Section */}
                {scenario.type === 'choice' && (
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {scenario.options?.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handlePassionChoice(option.id)}
                        className={`p-4 rounded-lg border-2 text-right transition-all hover:scale-102 ${passionAnswers[passionStep]?.choice === option.id ? 'transform scale-102' : ''}`}
                        style={{
                          borderColor: passionAnswers[passionStep]?.choice === option.id ? '#C8991A' : '#E5E7EB',
                          backgroundColor: passionAnswers[passionStep]?.choice === option.id ? '#F5E6C8' : '#FFFFFF',
                        }}
                      >
                        <span className="text-lg font-bold ml-3" style={{ color: '#C8991A' }}>{option.id}</span>
                        <span className="text-base" style={{ color: '#1A1A2E' }} dir="rtl">{option.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {scenario.type === 'rating' && (
                  <div className="mb-8 space-y-6">
                    {/* Excitement Rating */}
                    <div>
                      <p className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }} dir="rtl">إيه مستوى حماسك؟</p>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={`ex-${val}`}
                            onClick={() => handlePassionRating('excitement', val)}
                            className={`w-12 h-12 rounded-lg text-xl font-bold transition-all ${passionAnswers[passionStep]?.excitement === val ? 'transform scale-110' : ''}`}
                            style={{
                              backgroundColor: passionAnswers[passionStep]?.excitement === val ? '#C8991A' : '#FFFFFF',
                              color: passionAnswers[passionStep]?.excitement === val ? '#1A1A2E' : '#1A1A2E',
                              border: '2px solid #C8991A',
                            }}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Capability Rating */}
                    <div>
                      <p className="text-lg font-bold mb-3" style={{ color: '#1A1A2E' }} dir="rtl">إيه مستوى ثقة؟</p>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={`cap-${val}`}
                            onClick={() => handlePassionRating('capability', val)}
                            className={`w-12 h-12 rounded-lg text-xl font-bold transition-all ${passionAnswers[passionStep]?.capability === val ? 'transform scale-110' : ''}`}
                            style={{
                              backgroundColor: passionAnswers[passionStep]?.capability === val ? '#0D6B6E' : '#FFFFFF',
                              color: passionAnswers[passionStep]?.capability === val ? '#FFFFFF' : '#1A1A2E',
                              border: '2px solid #0D6B6E',
                            }}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation within passion step */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => { if (passionStep > 1) setPassionStep(passionStep - 1) }}
                    disabled={passionStep === 1}
                    className="px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-30"
                    style={{ border: '2px solid #C8991A', color: '#C8991A' }}
                  >
                    السابق
                  </button>

                  <button
                    onClick={() => {
                      if (passionStep < 10) {
                        setPassionStep(passionStep + 1)
                        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
                      } else {
                        proceedToResults()
                      }
                    }}
                    disabled={!canProceedFromPassion()}
                    className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
                  >
                    {passionStep < 10 ? (passionAnswers[passionStep] ? 'التالي' : 'اختر إجابة') : 'شوف النتيجة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Passion Results */}
        {currentStep === 3 && showResults && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">نتيجتك</h2>
            <p className="mb-6" style={{ color: '#1A1A2E', opacity: 0.7 }}>بعد ما خلّيت الـ ١٠ سيناريوهات — هنا اللي يميزك.</p>

            {/* Section 1: Best-Fit Field */}
            <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#C8991A' }} dir="rtl">مجالك الأنسب</h3>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{CAREER_TRACKS.find(t => t.id === passionResults.bestFitField)?.titleAr === 'أكاديميا و البحث' ? '🔬' : CAREER_TRACKS.find(t => t.id === passionResults.bestFitField)?.titleAr === 'المعلومات الحيوية' ? '💻' : CAREER_TRACKS.find(t => t.id === passionResults.bestFitField)?.titleAr === 'مبيعات طبية و أدوية' ? '💼' : '🏭'}</span>
                <div>
                  <h4 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                    {CAREER_TRACKS.find(t => t.id === passionResults.bestFitField)?.titleAr}
                  </h4>
                  <p className="text-sm" style={{ color: '#1A1A2E', opacity: 0.7 }}>
                    {CAREER_TRACKS.find(t => t.id === passionResults.bestFitField)?.titleEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Passion Type */}
            <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '2px solid #C8991A' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#C8991A' }} dir="rtl">تصنيفك</h3>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{PASSION_TYPES.find(p => p.id === passionResults.passionType)?.icon || '🔬'}</span>
                <h4 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">
                  {PASSION_TYPES.find(p => p.id === passionResults.passionType)?.titleAr}
                </h4>
              </div>
              <p className="text-base" style={{ color: '#1A1A2E', opacity: 0.8 }} dir="rtl">
                {PASSION_TYPES.find(p => p.id === passionResults.passionType)?.desc}
              </p>
            </div>

            {/* Section 3: Field Rankings */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1A1A2E' }} dir="rtl">ترتيب مجالاتك</h3>
              {passionResults.fieldRankings?.slice(0, 6).map((rank, idx) => {
                const track = CAREER_TRACKS.find(t => t.id === rank.field)
                const maxScore = passionResults.fieldRankings?.[0]?.score || 1
                const percentage = maxScore > 0 ? Math.round((rank.score / maxScore) * 100) : 0
                return (
                  <div key={rank.field} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: '#1A1A2E' }} dir="rtl">{track?.titleAr}</span>
                      <span className="text-sm" style={{ color: idx < 3 ? '#0D6B6E' : '#9CA3AF' }}>{percentage}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: idx < 3 ? '#0D6B6E' : '#9CA3AF' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Section 4: Important Note */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FAFAF7', border: '1px solid #E5E7EB' }}>
              <p className="text-base" style={{ color: '#1A1A2E', opacity: 0.8 }} dir="rtl">
                النتيجة دي مش حكم نهائي — هي بداية. في الخطوة الجاية هتختار مساراتك الـ٣ بنفسك. بس دلوقتي عندك بيانات.
              </p>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between">
              <button
                onClick={() => { setShowResults(false); setPassionStep(1); setPassionAnswers({}) }}
                className="px-6 py-3 rounded-lg font-bold transition-all"
                style={{ border: '2px solid #C8991A', color: '#C8991A' }}
              >
                ارجع للسيناريوهات
              </button>
              <button
                onClick={() => { handleNext(); preSelectTopTracks() }}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90"
                style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
              >
                تابع
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Career Tracks */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A2E', fontFamily: 'var(--font-cairo)' }} dir="rtl">اختر مساراتك</h2>
            <p className="mb-4" style={{ color: '#1A1A2E', opacity: 0.7 }}>BioCareerMap requires you to have 3 career tracks — not one. This protects you from market shifts and currency crises.</p>
            <p className="mb-8 text-sm" style={{ color: '#1A1A2E', opacity: 0.8 }} dir="rtl">
              مسارك الأساسي هو حلمك. مسارك الثانوي هو احتياطك. مسارك الثالث يبقيك مالياً مهما حدث.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {CAREER_TRACKS.map((track) => {
                const isSelected = selectedTracks.primary === track.id || selectedTracks.secondary === track.id || selectedTracks.tertiary === track.id
                const label = getTrackLabel(track.id)
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrackSelect(track.id)}
                    className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                    style={{
                      borderColor: isSelected ? '#C8991A' : '#E5E7EB',
                      backgroundColor: isSelected ? '#F5E6C8' : '#FFFFFF',
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold" style={{ color: '#1A1A2E' }} dir="rtl">{track.titleAr}</h3>
                      {label && (
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}>{label}</span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: '#1A1A2E', opacity: 0.7 }}>{track.titleEn}</p>
                    <p className="text-xs mb-1" style={{ color: '#0D6B6E' }}>Salary: {track.salary}</p>
                    <p className="text-xs mb-1" style={{ color: '#1A1A2E', opacity: 0.6 }}>Certs: {track.certs}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${track.demand === 'High' ? 'bg-green-100 text-green-800' : track.demand === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        Market Demand: {track.demand}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected Tracks Summary */}
            {Object.keys(selectedTracks).length > 0 && (
              <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F5E6C8' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#1A1A2E' }} dir="rtl">مساراتك المختارة</h3>
                <div className="space-y-2">
                  {selectedTracks.primary && (
                    <p style={{ color: '#1A1A2E' }} dir="rtl"><strong>أساسي:</strong> {CAREER_TRACKS.find(t => t.id === selectedTracks.primary)?.titleAr}</p>
                  )}
                  {selectedTracks.secondary && (
                    <p style={{ color: '#1A1A2E' }} dir="rtl"><strong>ثانوي:</strong> {CAREER_TRACKS.find(t => t.id === selectedTracks.secondary)?.titleAr}</p>
                  )}
                  {selectedTracks.tertiary && (
                    <p style={{ color: '#1A1A2E' }} dir="rtl"><strong>ثالث:</strong> {CAREER_TRACKS.find(t => t.id === selectedTracks.tertiary)?.titleAr}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-lg font-bold transition-all"
                style={{ border: '2px solid #C8991A', color: '#C8991A' }}
              >
                السابق
              </button>

              <button
                onClick={handleNext}
                disabled={Object.keys(selectedTracks).length < 3}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#C8991A', color: '#1A1A2E' }}
              >
                {saving ? 'جاري الحفظ...' : 'إنهاء واحفظ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
