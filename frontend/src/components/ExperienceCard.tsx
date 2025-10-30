import React from 'react';
import type { Experience } from '../types/experience';

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onViewDetails }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-[280px] h-[312px]">
      <div className="h-[160px] w-full overflow-hidden">
        <img 
          src={experience.imageUrl || experience.image} 
          alt={experience.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-4 bg-gray-50 h-[152px] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{experience.title}</h3>
            <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-md flex-shrink-0 line-clamp-1">
              {experience.location}
            </span>
          </div>
          
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3">
            {experience.shortDescription}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">From</div>
            <div className="text-base font-semibold text-gray-900">₹{experience.price}</div>
          </div>
          <button 
            onClick={() => onViewDetails(experience._id)}
            className="bg-[#FFD247] px-3 py-2 rounded-lg font-semibold hover:brightness-95 transition-all text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;