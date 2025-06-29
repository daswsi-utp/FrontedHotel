'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as service from '../promotions/service/promotionService'
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<service.Promotion[]>([]);
  const [roomTypes, setRoomTypes] = useState<service.RoomType[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [search, setSearch] = useState('');
  const [selectedProm, setSelectedProm] = useState<service.Promotion | null>(null);
  const [promToBeEdited, setPromToBeEdited] = useState<service.Promotion | null>(null);
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [newPromotion, setNewPromotion] = useState<service.PromotionRequest>({
    name: '',
    description: '',
    discountValue: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
    type: 'percentage',
    isActive: true,
    minStay: 1,
    roomApplicability: 'all',
    roomsIds: [],
  });

  const filtered = promotions
    .filter(p => filter === 'All' || (filter === "Active" && p.isActive || filter === "Inactive" && !p.isActive))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const fetchPromotions = async ()=>{
      try {
        const data = await service.getAllPromotions();
        setPromotions(data);
      } catch (error) {
        console.error("Failed to get promotions", error);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    const fetchRoomTypes = async () => { 
      try {
        const data = await service.getAllRoomTypes();
        setRoomTypes(data);
      } catch (error) {
        console.error("Failed to get roomTypes", error);
      }
    }
    fetchRoomTypes();
  }, []);
  const handleRoomTypeSelectionChange = (roomTypeId:number) => {
    const currentIds = [...newPromotion.roomsIds];
    const index = currentIds.indexOf(roomTypeId);

    if (index === -1) {
      currentIds.push(roomTypeId);
    } else {
      currentIds.splice(index, 1);
    }
    
    setNewPromotion({
      ...newPromotion,
      roomsIds: currentIds
    });
  };
  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();
    try{
      if(!newPromotion) return;
      await service.savePromotionRequest(newPromotion);
      setShowAddPromotion(false);
      const updated = await service.getAllPromotions();
      setPromotions(updated);
    } catch (error){
      console.error("Saving promotion failed", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | boolean = value;

    if(name==="isActive"){
      processedValue = value === "true";
    }

    setNewPromotion(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
  <>
    <div className="p-6 space-y-6">
      {/* Title and button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Promotions & Discounts</h1>
        <button onClick={() => setShowAddPromotion(true)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Add New Promotion
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search promotions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <div className="space-x-2">
          {(['All', 'Active', 'Inactive'] as const).map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3 py-1 rounded-full border ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              {[
                'Title',
                'Discount type',
                'Discount',
                'Start date',
                'End date',
                'Minimum Stay',
                'Applicable Rooms',
                'Status',
                'Actions',
              ].map(col => (
                <th key={col} className="px-4 py-2 text-sm font-medium text-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(promo => (
              <tr key={promo.promotionId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{promo.name}</div>
                  <div className="text-gray-500 text-xs">{promo.description.substring(0,60)}...</div>
                </td>
                <td className="px-4 py-3 text-sm">{promo.type}</td>
                <td className="px-4 py-3 text-sm">{
                  promo.type === 'percentage' ? `${promo.discountValue}% off` : 
                    promo.type === 'fixed' ? `${promo.discountValue} off` : 'Added value'
                }</td>
                <td className="px-4 py-3 text-sm">{promo.startDate}</td>
                <td className="px-4 py-3 text-sm">{promo.endDate}</td>
                <td className="px-4 py-3 text-sm">{promo.minStay}</td>
                <td className="px-4 py-3 text-sm">{promo.roomApplicability}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      promo.isActive === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promo.isActive === true ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <Link href={`/dashboard/promotions/${promo.promotionId}/edit`}>
                    <button className="text-blue-600 underline text-xs" onClick={() => setPromToBeEdited(promo)}>Edit</button>
                  </Link>
                  <button className="text-blue-600 underline text-xs" onClick={() => setSelectedProm(promo)}>Details</button>
                  <button className="text-red-600 underline text-xs">
                    {promo.isActive === true ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProm && (
        <div id="details-modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedProm.name}
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Description</h4>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {selectedProm.description}
                </p>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Applied room types</h4>
                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                  {selectedProm.roomsTypes.map((roomType) =>(
                    <li key={roomType.roomTypeId}>{roomType.name}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button onClick={() => setSelectedProm(null)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel to create a new promotion */}
      {showAddPromotion && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded shadow mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Create New Promotion</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Title *</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select 
                  name="type"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="percentage">Percentage Off</option>
                  <option value="fixed">Fixed Amount Off</option>
                  <option value="added_value">Value Added (No direct discount)</option>
                </select>
              </div>

              {newPromotion.type !== 'added_value' && (
                <div className="block text-sm font-medium text-gray-700 mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newPromotion.type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                  </label>
                  <input 
                    type="number" 
                    name="discountValue"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={newPromotion.discountValue}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              )}

              <div className="block text-sm font-medium text-gray-700 mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input 
                  type="date" 
                  name="startDate"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input 
                  type="date" 
                  name="endDate"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimun Stay (Nights)</label>
                <input 
                  type="number" 
                  name="minStay"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.minStay}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              <div className="block text-sm font-medium text-gray-700 mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="isActive"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={newPromotion.isActive}
                  onChange={handleInputChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="block text-sm font-medium text-gray-700 mb-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description"
                className="w-full p-3 border border-gray-300 rounded resize-y min-h-[120px]"
                value={newPromotion.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Rooms</label>
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="allRooms"
                    name="roomApplicability"
                    value="all"
                    checked={newPromotion.roomApplicability === 'all'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allRooms">All Rooms</label>
                </div>

                <div className="inline-flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="selectedRooms"
                    name="roomApplicability"
                    value="selected"
                    checked={newPromotion.roomApplicability === 'selected'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="selectedRooms">Selected Rooms Only</label>
                </div>

                {newPromotion.roomApplicability === 'selected' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {roomTypes.map(room => (
                      <label 
                        key={room.roomTypeId} 
                        className="inline-flex items-center gap-2"
                      >
                        <input 
                          type="checkbox" 
                          checked={newPromotion.roomsIds.includes(room.roomTypeId)}
                          onChange={() => handleRoomTypeSelectionChange(room.roomTypeId)}
                        />
                        {room.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setShowAddPromotion(false)} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                Cancel
              </button>
              <button primary type="submit" className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                Save Promotion
              </button>
            </div>
          </form>
        </motion.div>
  )}
  </div>
  </>
  );
}
