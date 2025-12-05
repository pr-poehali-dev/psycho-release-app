import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

type MoodType = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible' | null;

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [activeSoundIndex, setActiveSoundIndex] = useState<number | null>(null);
  const meditationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && (meditationTimer > 0 || meditationSeconds > 0)) {
      meditationIntervalRef.current = setInterval(() => {
        setMeditationSeconds((prev) => {
          if (prev > 0) return prev - 1;
          if (meditationTimer > 0) {
            setMeditationTimer((t) => t - 1);
            return 59;
          }
          setIsPlaying(false);
          return 0;
        });
      }, 1000);
    } else {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
        meditationIntervalRef.current = null;
      }
    }
    return () => {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    };
  }, [isPlaying, meditationTimer, meditationSeconds]);

  const handleBreathingCycle = () => {
    setIsBreathingActive(!isBreathingActive);
    if (!isBreathingActive) {
      let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
      const interval = setInterval(() => {
        if (phase === 'inhale') phase = 'hold';
        else if (phase === 'hold') phase = 'exhale';
        else phase = 'inhale';
        setBreathPhase(phase);
      }, 4000);
      return () => clearInterval(interval);
    }
  };

  const startMeditation = (durationMinutes: number) => {
    setMeditationTimer(durationMinutes - 1);
    setMeditationSeconds(59);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (meditationTimer === 0 && meditationSeconds === 0) return;
    setIsPlaying(!isPlaying);
  };

  const toggleSound = (index: number) => {
    setActiveSoundIndex(activeSoundIndex === index ? null : index);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const moods = [
    { type: 'amazing' as MoodType, emoji: '😊', label: 'Отлично' },
    { type: 'good' as MoodType, emoji: '🙂', label: 'Хорошо' },
    { type: 'okay' as MoodType, emoji: '😐', label: 'Нормально' },
    { type: 'bad' as MoodType, emoji: '😟', label: 'Плохо' },
    { type: 'terrible' as MoodType, emoji: '😢', label: 'Ужасно' },
  ];

  const meditations = [
    { title: 'Утреннее пробуждение', duration: 10, durationLabel: '10 мин', category: 'Энергия', icon: 'Sunrise' },
    { title: 'Снятие стресса', duration: 15, durationLabel: '15 мин', category: 'Релакс', icon: 'Cloud' },
    { title: 'Вечерний покой', duration: 20, durationLabel: '20 мин', category: 'Сон', icon: 'Moon' },
    { title: 'Фокус и концентрация', duration: 12, durationLabel: '12 мин', category: 'Работа', icon: 'Target' },
  ];

  const sounds = [
    { title: 'Дождь в лесу', icon: 'CloudRain', color: 'bg-lavender-200' },
    { title: 'Океанские волны', icon: 'Waves', color: 'bg-blue-200' },
    { title: 'Горный ручей', icon: 'Droplets', color: 'bg-cyan-200' },
    { title: 'Птицы в саду', icon: 'Bird', color: 'bg-green-200' },
    { title: 'Тихий ветер', icon: 'Wind', color: 'bg-lavender-100' },
    { title: 'Костёр', icon: 'Flame', color: 'bg-peach-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-white to-lavender-100">
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-300 to-lavender-400 rounded-3xl flex items-center justify-center animate-float shadow-lg">
              <Icon name="Sparkles" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Психоразгрузка</h1>
          <p className="text-muted-foreground text-lg">Ваше пространство для спокойствия</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-14 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="home" className="flex flex-col gap-1">
              <Icon name="Home" size={20} />
              <span className="text-xs">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="meditate" className="flex flex-col gap-1">
              <Icon name="Brain" size={20} />
              <span className="text-xs">Медитация</span>
            </TabsTrigger>
            <TabsTrigger value="breathe" className="flex flex-col gap-1">
              <Icon name="Wind" size={20} />
              <span className="text-xs">Дыхание</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex flex-col gap-1">
              <Icon name="BookHeart" size={20} />
              <span className="text-xs">Дневник</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col gap-1">
              <Icon name="User" size={20} />
              <span className="text-xs">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-lavender-200 to-lavender-300 border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Heart" size={28} className="text-red-400" />
                  Как вы себя чувствуете?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center flex-wrap">
                  {moods.map((mood) => (
                    <button
                      key={mood.type}
                      onClick={() => setSelectedMood(mood.type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                        selectedMood === mood.type
                          ? 'bg-white shadow-lg scale-110'
                          : 'bg-white/50 hover:bg-white/80 hover:scale-105'
                      }`}
                    >
                      <span className="text-4xl">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('meditate')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Brain" size={24} className="text-lavender-400" />
                      Медитации
                    </CardTitle>
                    <Badge className="bg-lavender-200 text-lavender-500">12 программ</Badge>
                  </div>
                  <CardDescription>Найдите внутренний покой</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center">
                    <Icon name="Sparkles" size={48} className="text-lavender-400 animate-breathe" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('breathe')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Wind" size={24} className="text-cyan-400" />
                      Дыхательные практики
                    </CardTitle>
                    <Badge className="bg-cyan-100 text-cyan-600">5 техник</Badge>
                  </div>
                  <CardDescription>Успокойте разум через дыхание</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 animate-breathe flex items-center justify-center">
                      <Icon name="Wind" size={48} className="text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Volume2" size={24} className="text-green-500" />
                  Звуки природы
                </CardTitle>
                <CardDescription>Расслабьтесь под звуки природы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sounds.map((sound, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleSound(idx)}
                      className={`${sound.color} p-6 rounded-2xl flex flex-col items-center gap-3 transition-all shadow-md relative ${
                        activeSoundIndex === idx ? 'ring-4 ring-lavender-400 scale-105' : 'hover:scale-105'
                      }`}
                    >
                      {activeSoundIndex === idx && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lavender-500 rounded-full flex items-center justify-center animate-pulse">
                          <Icon name="Volume2" size={16} className="text-white" />
                        </div>
                      )}
                      <Icon name={sound.icon as any} size={32} />
                      <span className="text-sm font-medium text-center">{sound.title}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meditate" className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-lavender-300 to-lavender-400 text-white border-none shadow-xl">
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-4">
                  <button
                    onClick={togglePlayPause}
                    className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={40} />
                  </button>
                  <h3 className="text-3xl font-bold font-mono">
                    {(meditationTimer > 0 || meditationSeconds > 0) 
                      ? formatTime(meditationTimer, meditationSeconds)
                      : 'Выберите медитацию'
                    }
                  </h3>
                  <p className="text-lavender-50">
                    {isPlaying ? 'Практика идёт...' : 'Начните свою практику'}
                  </p>
                  {(meditationTimer > 0 || meditationSeconds > 0) && (
                    <Progress 
                      value={((meditationTimer * 60 + meditationSeconds) / (20 * 60)) * 100} 
                      className="w-full max-w-md mx-auto h-2"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {meditations.map((med, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-lavender-100 rounded-2xl flex items-center justify-center">
                        <Icon name={med.icon as any} size={28} className="text-lavender-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{med.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{med.category}</Badge>
                          <span className="text-sm text-muted-foreground">{med.durationLabel}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="rounded-full w-12 h-12 p-0"
                      onClick={() => startMeditation(med.duration)}
                    >
                      <Icon name="Play" size={20} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breathe" className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-xl">
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center justify-center space-y-8">
                  <div 
                    className={`w-64 h-64 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-400 flex items-center justify-center shadow-2xl transition-all duration-4000 ${
                      isBreathingActive ? 'animate-breathe' : ''
                    }`}
                  >
                    <div className="text-center text-white">
                      <Icon name="Wind" size={64} className="mx-auto mb-4" />
                      <p className="text-2xl font-bold">
                        {isBreathingActive 
                          ? breathPhase === 'inhale' ? 'Вдох' 
                          : breathPhase === 'hold' ? 'Задержка' 
                          : 'Выдох'
                          : 'Готовы?'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleBreathingCycle}
                    className="w-48 h-14 text-lg rounded-full"
                  >
                    {isBreathingActive ? 'Остановить' : 'Начать практику'}
                  </Button>

                  <p className="text-center text-muted-foreground max-w-md">
                    Следуйте ритму дыхания: вдох 4 секунды, задержка 4 секунды, выдох 4 секунды
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Другие дыхательные техники</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {['4-7-8 техника', 'Квадратное дыхание', 'Дыхание для сна', 'Энергизирующее дыхание'].map((technique, idx) => (
                  <Button key={idx} variant="outline" className="justify-start h-14 text-left">
                    <Icon name="Wind" size={20} className="mr-3" />
                    {technique}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-peach-50 to-peach-100 border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookHeart" size={28} className="text-rose-400" />
                  Дневник настроения
                </CardTitle>
                <CardDescription>Отслеживайте своё эмоциональное состояние</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Как вы себя чувствуете сегодня?</label>
                  <div className="flex gap-3 justify-center">
                    {moods.map((mood) => (
                      <button
                        key={mood.type}
                        onClick={() => setSelectedMood(mood.type)}
                        className={`text-5xl transition-transform ${
                          selectedMood === mood.type ? 'scale-125' : 'scale-100 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Уровень стресса</label>
                  <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Спокоен</span>
                    <span>Напряжён</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Качество сна</label>
                  <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Плохо</span>
                    <span>Отлично</span>
                  </div>
                </div>

                <Button className="w-full h-12">Сохранить запись</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История записей</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { date: 'Сегодня', mood: '😊', stress: 30 },
                  { date: 'Вчера', mood: '🙂', stress: 50 },
                  { date: '2 дня назад', mood: '😐', stress: 60 },
                ].map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{entry.mood}</span>
                      <div>
                        <p className="font-medium">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">Стресс: {entry.stress}%</p>
                      </div>
                    </div>
                    <Progress value={100 - entry.stress} className="w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            {!showTrialModal ? (
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Gift" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-green-900">Попробуйте бесплатно 7 дней!</h3>
                      <p className="text-sm text-green-700 mb-4">
                        Получите полный доступ ко всем функциям приложения на неделю. Отменить можно в любой момент.
                      </p>
                      <Button 
                        onClick={() => setShowTrialModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Активировать пробный период
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-lavender-100 to-lavender-200 border-lavender-300 shadow-xl">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={40} className="text-white" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">Пробный период активирован!</h3>
                  <p className="text-muted-foreground mb-4">
                    У вас есть 7 дней полного доступа ко всем функциям
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Icon name="Calendar" size={16} className="text-lavender-500" />
                    <span>Действует до 12 декабря 2025</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-green-500" />
                  Ваш прогресс
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-lavender-50 rounded-2xl">
                    <div className="text-3xl font-bold text-lavender-500">14</div>
                    <p className="text-sm text-muted-foreground mt-1">дней подряд</p>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-2xl">
                    <div className="text-3xl font-bold text-cyan-500">42</div>
                    <p className="text-sm text-muted-foreground mt-1">медитаций</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl">
                    <div className="text-3xl font-bold text-green-500">180</div>
                    <p className="text-sm text-muted-foreground mt-1">минут</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Уровень спокойствия</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-lavender-400 to-lavender-500 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Crown" size={24} />
                  Премиум подписка
                </CardTitle>
                <CardDescription className="text-lavender-100">
                  Разблокируйте все возможности
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    'Доступ ко всем медитациям',
                    'Расширенная аналитика',
                    'Персональные рекомендации',
                    'Офлайн режим',
                    'Без рекламы',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon name="Check" size={18} className="text-lavender-100" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="secondary" className="h-20 flex-col bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40">
                    <div className="text-2xl font-bold">499₽</div>
                    <div className="text-xs text-lavender-100">в месяц</div>
                  </Button>
                  <Button variant="secondary" className="h-20 flex-col bg-white hover:bg-white/90 text-lavender-600 relative">
                    <Badge className="absolute -top-2 -right-2 bg-peach-100 text-peach-800 border-0">-40%</Badge>
                    <div className="text-2xl font-bold">2990₽</div>
                    <div className="text-xs">в год</div>
                  </Button>
                </div>

                <p className="text-xs text-lavender-100 text-center">
                  После окончания пробного периода подписка продлится автоматически
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Советы для улучшения сна</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: 'Moon', text: 'Ложитесь спать в одно и то же время' },
                  { icon: 'Sun', text: 'Избегайте яркого света за час до сна' },
                  { icon: 'Coffee', text: 'Не пейте кофеин после 16:00' },
                  { icon: 'Bed', text: 'Создайте комфортную обстановку в спальне' },
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                    <Icon name={tip.icon as any} size={20} className="text-lavender-500 mt-0.5" />
                    <p className="text-sm">{tip.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;