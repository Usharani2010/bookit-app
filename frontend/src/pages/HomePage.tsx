import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';
import { experienceAPI } from '../services/api';
import type { Experience } from '../types/experience';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetails = (id: string) => {
    navigate(`/experience/${id}`);
  };

  // Fetch experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experienceAPI.getAll();
        setExperiences(response.data);
        setFilteredExperiences(response.data);
      } catch (err) {
        setError('Failed to load experiences');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Search filter - Only filter when searchTerm changes (on enter/button click from header)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExperiences(filtered);
    }
  }, [searchTerm, experiences]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto px-16 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading experiences...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1400px] mx-auto px-16 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="max-w-[1400px] mx-auto px-16 py-10">


        {/* Experiences Grid */}
        <section>
          {filteredExperiences.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No experiences found matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#FFD247] hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
              {filteredExperiences.map((experience) => (
                <div key={experience._id} className="flex justify-center">
                  <ExperienceCard 
                    experience={experience} 
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;