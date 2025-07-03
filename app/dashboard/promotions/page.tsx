'use client';

import { useState, useEffect, useCallback } from 'react';
import * as service from '../promotions/service/promotionService'
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useDebounce } from './hooks/useDebounce';

export default function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<service.Promotion[]>([]);
  const [roomTypes, setRoomTypes] = useState<service.RoomType[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [selectedProm, setSelectedProm] = useState<service.Promotion | null>(null);
  const [promToBeEdited, setPromToBeEdited] = useState<service.Promotion | null>(null);
  const [editPromotion, setEditPromotion] = useState<service.PromotionRequest | null>(null);
  const [showEditPromotion, setShowEditPromotion] = useState(false);
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

  const fetchFilteredPromotions = useCallback(async () => {
      try {
        setLoading(true);
        const sanitizedSearch = debouncedSearch.trim();
        const sanitizedStatus = filter === "All" ? undefined : filter === "Active";
        const results = await service.searchPromotionsByNameAndOrStatus(
          sanitizedSearch === "" ? undefined : sanitizedSearch,
          sanitizedStatus
        );
        setPromotions(results)
      } catch (error) {
        if(process.env.NODE_ENV === "development"){
          console.error("Failed to get promotions", error);
        }
      } finally {
        setLoading(false);
      }
    }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchFilteredPromotions();
  }, [fetchFilteredPromotions]);

    
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
      await fetchFilteredPromotions();
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
    if(!editPromotion) return;
    const { name, value } = e.target;
    let processedValue: string | boolean | number = value;
    if(name==="isActive"){
      processedValue = value === "true";
    }
    if(name==="discountValue" || name === "minStay"){
      processedValue = Number(value);
    }

    setEditPromotion(prev => prev ? {
      ...prev,
      [name]: processedValue,
    } : null);
  };

  const handleEditRoomTypeSelectionChange = (roomTypeId: number) =>{
    if(!editPromotion) return;
    const currentIds = [...editPromotion.roomsIds];
    const index = currentIds.indexOf(roomTypeId);
    if(index === -1){
      currentIds.push(roomTypeId);
    } else {
      currentIds.splice(index, 1);
    }
    setEditPromotion({
      ...editPromotion,
      roomsIds: currentIds
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editPromotion || !promToBeEdited) return;
    try{
      await service.updatePromotion(promToBeEdited.promotionId, editPromotion);
      await fetchFilteredPromotions();
      setShowAddPromotion(false);
      setPromToBeEdited(null);
    } catch (err) {
      console.error("Failed to update the promotion:" , err);
    }
  }

  const openEditModal = (promo: service.Promotion) => {
    setPromToBeEdited(promo); 
    setEditPromotion({
    name: promo.name,
    description: promo.description,
    discountValue: promo.discountValue,
    startDate: promo.startDate,
    endDate: promo.endDate,
    type: promo.type,
    isActive: promo.isActive,
    minStay: promo.minStay,
    roomApplicability: promo.roomApplicability,
    roomsIds: promo.rooms?.map(rt => rt.roomTypeId) ?? [],
  });
    setShowEditPromotion(true);
  }
  
  if(!loading){
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
                    value={String(newPromotion.isActive)}
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
                      {roomTypes?.map(room => (
                        <label 
                          key={room.roomTypeId} 
                          className="inline-flex items-center gap-2"
                        >
                          <input 
                            type="checkbox" 
                            checked={newPromotion.roomsIds.includes(room.roomTypeId)}
                            onChange={() => handleRoomTypeSelectionChange(room.roomTypeId)}
                          />
                          {room.roomType}
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
                <button type="submit" className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                  Save Promotion
                </button>
              </div>
            </form>
          </motion.div>

        )}
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
              {promotions.map(promo => (
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
                    <button className="text-blue-600 underline text-xs" onClick={() => openEditModal(promo)}>Edit</button>
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
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration:0.3}}
            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-gray-900/50 backdrop-blur-sm"
          >
            <div
              data-dialog="animated-modal"
              data-dialog-mount="opacity-100 translate-y-0 scale-100"
              data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
              data-dialog-transition="transition-all duration-300"
              className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
            >
              <div className="text-center pb-4 text-xl font-medium text-slate-800">
                {selectedProm.name}
              </div>
              <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Description</h4>
                  <p>{selectedProm.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Applied Room Types</h4>
                  <ul className="list-disc list-inside">
                    {selectedProm.rooms?.map((room) => (
                      <li key={room.roomTypeId}>{room.roomType}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                <button
                  onClick={() => setSelectedProm(null)}
                  className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )} 
        
        {showEditPromotion && editPromotion && (
          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[999] bg-gray-900/50 backdrop-blur-sm -opacity-30 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow max-w-3xl w-full">
              <h2 className="text-xl font-semibold mb-6">Edit Promotion</h2>

              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Title *</label>
                    <input 
                      type="text" 
                      name="name"
                      className="w-full p-3 border border-gray-300 rounded"
                      value={editPromotion.name}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                    <select 
                      name="type"
                      className="w-full p-3 border border-gray-300 rounded"
                      value={editPromotion.type}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="percentage">Percentage Off</option>
                      <option value="fixed">Fixed Amount Off</option>
                      <option value="added_value">Value Added (No direct discount)</option>
                    </select>
                  </div>

                  {editPromotion.type !== 'added_value' && (
                    <div className="block text-sm font-medium text-gray-700 mb-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editPromotion.type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                      </label>
                      <input 
                        type="number" 
                        name="discountValue"
                        className="w-full p-3 border border-gray-300 rounded"
                        value={editPromotion.discountValue}
                        onChange={handleEditInputChange}
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
                      value={editPromotion.startDate}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input 
                      type="date" 
                      name="endDate"
                      className="w-full p-3 border border-gray-300 rounded"
                      value={editPromotion.endDate}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimun Stay (Nights)</label>
                    <input 
                      type="number" 
                      name="minStay"
                      className="w-full p-3 border border-gray-300 rounded"
                      value={editPromotion.minStay}
                      onChange={handleEditInputChange}
                      min="1"
                    />
                  </div>

                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      name="isActive"
                      className="w-full p-3 border border-gray-300 rounded"
                      value={String(editPromotion.isActive)}
                      onChange={handleEditInputChange}
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
                    value={editPromotion.description}
                    onChange={handleEditInputChange}
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
                        checked={editPromotion.roomApplicability === 'all'}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="allRooms">All Rooms</label>
                    </div>

                    <div className="inline-flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="selectedRooms"
                        name="roomApplicability"
                        value="selected"
                        checked={editPromotion.roomApplicability === 'selected'}
                        onChange={handleEditInputChange}
                      />
                      <label htmlFor="selectedRooms">Selected Rooms Only</label>
                    </div>

                    {editPromotion.roomApplicability === 'selected' && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {roomTypes?.map(room => (
                          <label 
                            key={room.roomTypeId} 
                            className="inline-flex items-center gap-2"
                          >
                            <input 
                              type="checkbox" 
                              checked={editPromotion.roomsIds.includes(room.roomTypeId)}
                              onChange={() => handleEditRoomTypeSelectionChange(room.roomTypeId)}
                            />
                            {room.roomType}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setShowEditPromotion(false)} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }
}
