'use client'
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import Rating from '@mui/material/Rating';
import { useState } from 'react';

interface CardProps {
    venueName: string;
    imgSrc: string;
    onCompare?: (venueName: string, rating: number) => void; // ทำให้เป็น optional
}

export default function Card({ venueName, imgSrc, onCompare }: CardProps) {
    const [value, setValue] = useState<number>(0);

    const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
        event.stopPropagation();

        if (newValue !== null) {
            setValue(newValue);
            onCompare?.(venueName, newValue); // ใช้ optional chaining เพื่อป้องกัน error
        }
    };

    return (
        <InteractiveCard contentName={venueName}>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image 
                    src={imgSrc}
                    alt='Product Picture'
                    fill={true}
                    className='object-cover rounded-t-lg'
                />
            </div>
            <div className='w-full h-[15%] p-[10px] mb-8'>
                <h3 style={{ color: "burlywood", marginBottom: "3px" }}>{venueName}</h3>
                
                <h5>A stunning bouquet hall where love blossoms and unforgettable memories are made.</h5>
            </div>
            {/* แสดง Rating เฉพาะเมื่อ onCompare ถูกส่งมา */}
            {onCompare && (
                <div className='ml-2' onClick={(e) => e.stopPropagation()}>
                    <Rating
                        id={`${venueName} Rating`}
                        name={`${venueName} Rating`}
                        data-testid={`${venueName} Rating`}
                        value={value}
                        onChange={handleRatingChange}
                    />
                </div>
            )}
        </InteractiveCard>
    );
}
