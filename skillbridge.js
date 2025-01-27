import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, Book, Target, Trophy, Briefcase, 
  LineChart, Star, Clock, ArrowRight 
} from 'lucide-react';

// Mock AI skill analysis data
const skillDatabase = {
  technical: [
    'Python Programming', 'Data Analysis', 'Machine Learning',
    'Web Development', 'Cloud Computing', 'DevOps'
  ],
  soft: [
    'Communication', 'Leadership', 'Problem Solving',
    'Team Collaboration', 'Time Management', 'Critical Thinking'
  ],
  careers: [
    'Data Scientist', 'Software Engineer', 'Product Manager',
    'Business Analyst', 'Cloud Architect', 'AI Engineer'
  ]
};

const mockLearningPaths = {
  'Data Scientist': [
    { name: 'Python Fundamentals', duration: '4 weeks' },
    { name: 'Data Analysis with Pandas', duration: '3 weeks' },
    { name: 'Machine Learning Basics', duration: '6 weeks' },
    { name: 'Deep Learning', duration: '8 weeks' }
  ],
  'Software Engineer': [
    { name: 'Programming Basics', duration: '4 weeks' },
    { name: 'Web Development', duration: '6 weeks' },
    { name: 'Database Management', duration: '3 weeks' },
    { name: 'System Design', duration: '5 weeks' }
  ]
};

const SkillBridgeAI = () => {
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Simulate AI analysis of skills
  const analyzeSkills = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const skills = currentSkills.toLowerCase().split(',').map(s => s.trim());
    const role = targetRole.toLowerCase();

    // Simulate AI matching
    const matchPercentage = Math.floor(Math.random() * 40) + 60;
    const gapAnalysis = skillDatabase.technical
      .filter(skill => !skills.includes(skill.toLowerCase()))
      .slice(0, 3);

    setAnalysis({
      match: matchPercentage,
      gaps: gapAnalysis,
      strengths: skills.filter(skill => 
        skillDatabase.technical.some(s => s.toLowerCase().includes(skill))
      ),
      recommendations: skillDatabase.technical
        .filter(skill => !skills.includes(skill.toLowerCase()))
        .slice(0, 4)
    });

    setMatchScore(matchPercentage);
    setLearningPath(mockLearningPaths[targetRole] || mockLearningPaths['Data Scientist']);
    setLoading(false);
  };

  // Generate career suggestions based on skills
  useEffect(() => {
    if (currentSkills) {
      const skills = currentSkills.toLowerCase().split(',').map(s => s.trim());
      const matches = skillDatabase.careers
        .filter(career => Math.random() > 0.5)
        .slice(0, 3);
      setSuggestions(matches);
    }
  }, [currentSkills]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">SkillBridge AI</h1>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Current Skills</h3>
                </div>
                <Input
                  placeholder="Enter your skills (comma-separated)"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Target Role</h3>
                </div>
                <Input
                  placeholder="Enter your target role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="mb-4"
                />
                <Button 
                  onClick={analyzeSkills} 
                  disabled={loading || !currentSkills || !targetRole}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Analyze Skills'}
                </Button>
              </CardContent>
            </Card>

            {/* Career Suggestions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Career Suggestions</h3>
                </div>
                <div className="space-y-3">
                  {suggestions.map((career, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <span>{career}</span>
                      <Button variant="ghost" size="sm">
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Skill Analysis</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Match Score</span>
                      <span className="font-bold text-blue-600">{analysis.match}%</span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.strengths.map((strength, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Skill Gaps</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.gaps.map((gap, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Recommended Learning Path</h3>
                  </div>
                  <div className="space-y-3">
                    {learningPath?.map((course, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                        </div>
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillBridgeAI;